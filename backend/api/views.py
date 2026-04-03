from rest_framework.decorators import api_view
from rest_framework.response import Response
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import json
import os
import time

# ===============================
# PATHS
# ===============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "ml_model", "skin_disease_model.keras")
CLASS_PATH = os.path.join(BASE_DIR, "ml_model", "class_names.json")

# ===============================
# LOAD MODEL
# ===============================
model = load_model(MODEL_PATH, compile=False)

# ===============================
# LOAD CLASS NAMES
# ===============================
with open(CLASS_PATH, "r") as f:
    class_indices = json.load(f)

CLASS_NAMES = {
    v: k for k, v in class_indices.items()
}  # {0: "Acne and Rosacea Photos", 1: "Atopic Dermatitis Photos", ...}

# ===============================
# DISEASE-SPECIFIC DATA (MATCHES YOUR CLASSES)
# ===============================
DISEASE_INFO = {
    "Acne and Rosacea Photos": {
        "description": "Acne (pimples, blackheads, whiteheads) or Rosacea (facial redness, visible blood vessels). Common skin conditions affecting face.",
        "advice": "Use gentle cleanser, benzoyl peroxide or salicylic acid. Rosacea: avoid triggers (sun, spicy food). See dermatologist if persistent.",
    },
    "Atopic Dermatitis Photos": {
        "description": "Atopic dermatitis (eczema) - Chronic itchy, inflamed skin with red patches, often on elbows/knees.",
        "advice": "Moisturize frequently, use steroid creams, avoid irritants. See dermatologist for prescription treatments if severe.",
    },
    "Eczema Photos": {
        "description": "Eczema - Inflamed, itchy, dry skin patches. Can ooze or crust when severe.",
        "advice": "Keep skin moisturized, use fragrance-free products, topical steroids. Severe cases need dermatologist evaluation.",
    },
    "Melanoma Skin Cancer Nevi and Moles": {
        "description": "Melanoma (dangerous skin cancer) or nevi/moles. Check ABCDE rule: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving.",
        "advice": "EMERGENCY: See dermatologist IMMEDIATELY for biopsy. Early melanoma is highly curable.",
    },
    "Psoriasis pictures Lichen Planus and related diseases": {
        "description": "Psoriasis (silvery scales on red patches) or Lichen Planus (purple, itchy bumps). Autoimmune skin conditions.",
        "advice": "Topical steroids, moisturizers. Psoriasis may need phototherapy or systemic meds. Consult dermatologist.",
    },
    "Tinea Ringworm Candidiasis and other Fungal Infections": {
        "description": "Fungal infections: Ringworm (circular red patches), Candidiasis (yeast infection), Athlete's foot.",
        "advice": "Antifungal creams (clotrimazole, terbinafine). Keep area dry/clean. Persistent cases need oral antifungals from doctor.",
    },
    "Uncertain - Please consult a dermatologist": {
        "description": "Prediction confidence too low (<50%) for reliable diagnosis.",
        "advice": "Cannot identify condition accurately. Consult dermatologist for professional evaluation.",
    },
}


# ===============================
# API
# ===============================
@api_view(["POST"])
def predict_disease(request):
    start_time = time.time()

    img_file = request.FILES.get("file")
    if not img_file:
        return Response({"error": "No image uploaded"}, status=400)

    image = Image.open(img_file).convert("RGB")
    image = image.resize((224, 224))

    img_array = img_to_array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)
    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    end_time = time.time()
    prediction_time = f"{(end_time - start_time):.2f}s"

    if confidence < 0.5:  # 50% threshold
        predicted_label = "Uncertain - Please consult a dermatologist"
    else:
        predicted_label = CLASS_NAMES[class_index]

    # Get disease info
    disease_info = DISEASE_INFO.get(
        predicted_label,
        {
            "description": "No description available for this condition.",
            "advice": "Consult a dermatologist for proper diagnosis and treatment.",
        },
    )

    return Response(
        {
            "predicted_disease": predicted_label,
            "confidence": round(confidence * 100, 2),
            "time": prediction_time,
            "description": disease_info["description"],
            "advice": disease_info["advice"],
            "model": "CNN Model",
        }
    )

import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.layers import Input

OLD_MODEL_PATH = "api/ml_model/skin_disease_model.h5"
NEW_MODEL_PATH = "api/ml_model/skin_disease_model_fixed.keras"

print("Loading old model without compiling...")
old_model = load_model(
    OLD_MODEL_PATH,
    compile=False,
    safe_mode=False
)

print("Rebuilding model to remove old InputLayer config...")

# Create new clean input
new_input = Input(shape=(224, 224, 3), name="input")

# Pass input through old model layers (skip old InputLayer)
x = new_input
for layer in old_model.layers[1:]:
    x = layer(x)

new_model = Model(inputs=new_input, outputs=x)

print("Saving fixed model...")
new_model.save(NEW_MODEL_PATH)

print("✅ Model fixed and saved successfully!")

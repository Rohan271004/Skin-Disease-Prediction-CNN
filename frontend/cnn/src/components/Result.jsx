import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';  // ✅ Now works!

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState("");
  const [prediction, setPrediction] = useState(location.state?.prediction || null);

  useEffect(() => {
    if (location.state?.prediction) {
      localStorage.setItem("lastPrediction", JSON.stringify(location.state.prediction));
      setPrediction(location.state.prediction);
    } else {
      const saved = localStorage.getItem("lastPrediction");
      if (saved) setPrediction(JSON.parse(saved));
    }
  }, [location.state]);

  if (!prediction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-600 text-lg mb-4">No prediction data found. Please upload an image first.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ PROFESSIONAL PDF REPORT
  const handleDownload = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("🩺 SKIN DISEASE REPORT", 105, 25, { align: 'center' });

    // Info Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DIAGNOSIS:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Disease: ${prediction.predicted_disease}`, 25, 62);
    doc.text(`Confidence: ${prediction.confidence}%`, 25, 72);
    doc.text(`Time: ${prediction.time}`, 25, 82);

    // Description
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION:", 20, 100);
    doc.setFont("helvetica", "normal");
    const desc = doc.splitTextToSize(prediction.description, 170);
    doc.text(desc, 25, 112);

    // Advice Box
    const adviceStartY = 112 + desc.length * 6;
    doc.setFillColor(220, 255, 220);
    doc.rect(20, adviceStartY - 5, 170, 40, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("💡 RECOMMENDATIONS:", 25, adviceStartY);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const advice = doc.splitTextToSize(prediction.advice, 165);
    doc.text(advice, 25, adviceStartY + 12);

    // Notes
    const notesStartY = adviceStartY + 45;
    doc.setFont("helvetica", "bold");
    doc.text("NOTES:", 20, notesStartY);
    doc.setFont("helvetica", "normal");
    const notes = doc.splitTextToSize(details || "No notes added", 170);
    doc.text(notes, 25, notesStartY + 12);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text("AI Skin Analysis | CNN Model | HAM10000 Dataset", 20, 280);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 287);

    // Signatures
    doc.line(25, 295, 75, 295);
    doc.text("Doctor", 25, 302);
    doc.line(125, 295, 175, 295);
    doc.text("Patient", 125, 302);

    // Save
    const filename = `SkinDisease_${prediction.predicted_disease.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-16 px-4 md:px-8 lg:px-16 flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 via-blue-600 to-gray-900 bg-clip-text text-transparent">
        Prediction Result
      </h2>

      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-10 transition-all duration-300 hover:shadow-2xl">
        <h3 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          {prediction.predicted_disease}
        </h3>

        <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Confidence:</span> {prediction.confidence}%
          </p>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Time:</span> {prediction.time}
          </p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
          <p className="text-gray-700">{prediction.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <InfoCard label="Model Used" value="CNN Model" />
          <InfoCard label="Dataset" value="HAM10000" />
        </div>

        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-8">
          <p className="text-gray-700">
            <span className="font-semibold">Advice:</span> {prediction.advice}
          </p>
        </div>

        <label htmlFor="details" className="block text-gray-700 font-semibold mb-2">
          Additional Details
        </label>
        <textarea
          id="details"
          rows={5}
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Doctor's notes or recommendations..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-1/2 bg-gradient-to-r from-gray-800 to-gray-600 text-white py-3 rounded-lg hover:from-gray-900 hover:to-gray-700 transition-all duration-300 font-semibold shadow-md"
          >
            Back to Home
          </button>

          <button
            onClick={handleDownload}
            className={`w-full sm:w-1/2 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${details.trim() === ""
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              }`}
          >
            {details.trim() === "" ? "Add Notes First" : "📄 Download PDF Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value }) => (
  <div className="p-4 bg-gray-50 border rounded-lg">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-800">{value}</p>
  </div>
);

export default Result;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";
import backgroundVideo from "../assets/background.mp4";
import leftIntroImage from "../assets/left-intro.png";
import rightIntroImage from "../assets/right-intro.png";

const Disease = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const startTime = Date.now();

      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      console.log("Backend Response:", data);

      // Minimum spinner duration for professional feel
      const elapsed = Date.now() - startTime;
      const minDuration = 1500;

      setTimeout(() => {
        navigate("/result", { state: { prediction: data } });
        setLoading(false);
      }, Math.max(0, minDuration - elapsed));
    } catch (error) {
      console.error("Error:", error);
      alert("Error predicting disease.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
          <img
            src={heroBg}
            alt="Fallback background"
            className="w-full h-full object-cover"
          />
        </video>

        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Skin Disease Detection Using Convolutional Neural Networks
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto">
            Transforming dermatological diagnostics with AI-powered accuracy and
            efficiency.
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <img
              src={leftIntroImage}
              alt="Skin anomaly close-up"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-600 to-gray-900 bg-clip-text text-transparent">
              Skin Disease Detection Using Convolutional Neural Networks
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
              Skin disease detection is undergoing a transformative shift
              through the integration of Convolutional Neural Networks (CNNs), a
              powerful deep learning technique. This approach leverages advanced
              machine learning to enhance the accuracy and efficiency of
              dermatological diagnostics.
            </p>
          </div>

          <div className="flex-shrink-0">
            <img
              src={rightIntroImage}
              alt="AI analysis visualization"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-12 rounded-lg shadow-md max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-blue-400 via-blue-600 to-gray-900 bg-clip-text text-transparent">
              Upload Image for Detection
            </h2>

            <div className="flex flex-col items-center">
              <div className="border-4 border-dashed border-gray-400 rounded-lg p-12 w-full cursor-pointer hover:border-blue-600 transition-colors duration-300">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded skin image"
                    className="max-w-full h-64 object-cover rounded mx-auto"
                  />
                ) : (
                  <div>
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400 mb-6 animate-pulse"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">
                      Drag & drop or click to select an image
                    </p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-6 hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="mt-6 bg-gradient-to-r from-blue-300 to-blue-100 text-gray-800 px-8 py-3 rounded-lg cursor-pointer hover:from-blue-400 hover:to-blue-200 text-lg font-semibold select-none transition-all duration-300 shadow-md focus:ring-2 focus:ring-blue-200 hover:shadow-lg"
              >
                Choose Image
              </label>

              {/* Predict Button */}
              {uploadedImage && (
                <button
                  onClick={handlePredict}
                  disabled={loading}
                  className={`mt-4 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-md ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Predicting...</span>
                    </div>
                  ) : (
                    "Predict"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Motivational Quotes Section */}
          <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-bounce-slow">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p className="text-lg italic text-gray-700">
                "Early detection is the key to effective treatment."
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse-slow">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-lg italic text-gray-700">
                "AI empowers dermatologists to make faster, more accurate
                diagnoses."
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center animate-spin-slower">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <p className="text-lg italic text-gray-700">
                "Combining technology and care for healthier skin worldwide."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Disease;

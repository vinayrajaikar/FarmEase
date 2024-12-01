import React, { useState, useEffect } from 'react'
import { Upload } from "lucide-react"
import axios from 'axios';
import { GetDiseaseInfo } from './GeminiCropAPI';

// Mock function to simulate disease detection

const trimTextResponse = (text) => {
    const match = text.match(/\[[\s\S]*?\]/); // Matches multi-line JSON array
    if (match) {
      try {
        return JSON.parse(match[0]); // Parse and return the JSON
      } catch (error) {
        throw new Error("Failed to parse JSON from response");
      }
    } else {
      throw new Error("No JSON array found in the response");
    }
  };

const API_URL = "http://127.0.0.1:5000/predict";  // Replace with Render URL

const initializeDisease = async (predicted_label) => {
    try {
      const response = await GetDiseaseInfo(predicted_label);
      const DiseaseInfo = trimTextResponse(response);
      return DiseaseInfo;
    } catch (error) {
      console.error("Error initializing crops:", error);
    }
  };

  async function predictDisease(imageFile) {
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Prediction:", response.data.predicted_label);

        const diseaseInfo = await initializeDisease(response.data.predicted_label);
        console.log(diseaseInfo);

        return {
            name: response.data.predicted_label,
            info: diseaseInfo?.[0] || "No description available.", // The first element is the disease description
            instructions: diseaseInfo?.slice(1).join("\n") || "No instructions available.", // The rest are step-by-step instructions
        };
    } catch (error) {
        console.error("Error during prediction:", error);
    }
}


function DiseaseDetector() {
    const [image, setImage] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [diseaseData, setDiseaseData] = useState(null);

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.onload = () => {
                const width = Math.min(img.width, 250);
                const height = img.height * (width / img.width);
                setAspectRatio(width / height);
            };
            img.src = image;
        }
    }, [image]);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setIsLoading(true);
            setDiseaseData(null);
            try {
                const result = await predictDisease(file);
                setDiseaseData(result); // Update disease data for rendering
            } catch (error) {
                console.error("Error detecting disease:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <div className="flex flex-col justify-center items-center lg:flex-row gap-6">
                <div>
                    <h1 className="text-2xl font-bold mb-8">Plant Disease Detection</h1>
                    <div className="flex flex-col items-center gap-4">
                        {image && (
                            <div
                                className="w-full max-w-[250px] bg-gray-100 rounded-lg shadow-md overflow-hidden"
                                style={{ aspectRatio: aspectRatio }}
                            >
                                <img
                                    src={image}
                                    alt="Uploaded plant"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            Upload a picture of your plant
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                        </label>
                    </div>

                    {isLoading && (
                        <div className="w-full p-4 m-4 bg-gray-200 rounded-lg animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                    )}

                    {diseaseData && (
                        <div className="bg-green-100 p-6 rounded-lg shadow-sm m-4">
                            <h2 className="text-xl font-semibold mb-2">Disease Identified: {diseaseData.name}</h2>
                            <p className="text-gray-700 leading-relaxed">{diseaseData.info}</p>
                        </div>
                    )}
                </div>

                {diseaseData && (
                    <div className="lg:w-1/2">
                        <div className="border p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">Instructions and Cure:</h3>
                            <div className="space-y-2">
                                {diseaseData.instructions.split('\n').map((instruction, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-sm text-emerald-700 font-medium">{index + 1}</span>
                                        </div>
                                        <p className="text-gray-700 text-left leading-relaxed">
                                            {instruction}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export default DiseaseDetector

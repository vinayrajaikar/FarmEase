import React, { useEffect, useState } from 'react';
import { GetCropReccomendations } from './GeminiCropAPI';

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

const fetchCropImage = async (cropName) => {
  const url = `https://free-images-api.p.rapidapi.com/v2/${cropName}/1`;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-rapidapi-ua": "RapidAPI-Playground",
    "x-rapidapi-key": "02d665059bmsh7db8552860ff267p1a9386jsn53c48c6d4f15", // Replace with your RapidAPI key
    "x-rapidapi-host": "free-images-api.p.rapidapi.com",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results?.[1]?.image || "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg"; // Return the image URL or a placeholder
  } catch (error) {
    console.error(`Error fetching image for ${cropName}:`, error);
    return "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg"; // Return placeholder on error
  }
};

const CropRecommendations = () => {
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [cropImages, setCropImages] = useState({}); // State to store images for each crop

 

  const fetchAllCropImages = async (crops) => {
    const images = {};
    for (const crop of crops) {
      images[crop] = await fetchCropImage(crop);
    }
    setCropImages(images); // Single update after fetching all images
  };
  


  useEffect(() => {
    const initializeCrops = async () => {
      try {
        const response = await GetCropReccomendations();
        const crops = trimTextResponse(response);
        setRecommendedCrops(crops); // Set crops once
        await fetchAllCropImages(crops);
      } catch (error) {
        console.error("Error initializing crops:", error);
      }
    };
    initializeCrops();
  }, []);
  

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-lg font-semibold sm:text-xl text-left">
        Our recommendations for given conditions and location
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
        {recommendedCrops.map((crop, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className="relative h-16 w-16 overflow-hidden rounded-full sm:h-24 sm:w-24">
              <img
                src={cropImages[crop] || "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg"} // Use the image URL from state
                alt={crop}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-center text-xs font-medium sm:text-sm">{crop}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropRecommendations;

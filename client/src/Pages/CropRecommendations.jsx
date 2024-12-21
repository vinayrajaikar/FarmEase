import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetCropReccomendations } from "./GeminiCropAPI";

const trimTextResponse = (text) => {
  const match = text.match(/\[[\s\S]*?\]/);
  if (match) {
    try {
      return JSON.parse(match[0]);
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
    "x-rapidapi-key": "02d665059bmsh7db8552860ff267p1a9386jsn53c48c6d4f15",
    "x-rapidapi-host": "free-images-api.p.rapidapi.com",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (cropName == "Sugarcane") {
      return data.results?.[4]?.image || "/placeholder.svg";
    }
    return data.results?.[1]?.image || "/placeholder.svg";
  } catch (error) {
    console.error(`Error fetching image for ${cropName}:`, error);
    return "/placeholder.svg";
  }
};

const CropRecommendations = () => {
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [cropImages, setCropImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAllCropImages = async (crops) => {
    const images = {};
    for (const crop of crops) {
      images[crop] = await fetchCropImage(crop);
    }
    setCropImages(images);
  };

  useEffect(() => {
    const initializeCrops = async () => {
      try {
        setIsLoading(true);
        const response = await GetCropReccomendations();
        const crops = trimTextResponse(response);
        setRecommendedCrops(crops);
        await fetchAllCropImages(crops);
        setError(null);
      } catch (error) {
        console.error("Error initializing crops:", error);
        setError(
          "Failed to load crop recommendations. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };
    initializeCrops();
  }, []);

  const handleImageClick = (cropNames, imageUrls) => {
    navigate("/cropdetail", { state: { cropNames, imageUrls } });
  };

  return (
    <Card className="w-full text-[#4A3933] shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recommended Crops</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {recommendedCrops.map((crop, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div
                  className="relative h-24 w-24 overflow-hidden rounded-full cursor-pointer transition-transform hover:scale-105"
                  onClick={() =>
                    handleImageClick(
                      crop,
                      cropImages[crop] || "/placeholder.svg"
                    )
                  }
                >
                  <img
                    src={cropImages[crop] || "/placeholder.svg"}
                    alt={crop}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="text-center text-sm font-medium text-[#6B5750]">
                  {crop}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CropRecommendations;

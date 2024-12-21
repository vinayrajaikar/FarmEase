import React, { useEffect, useState } from "react";
import { Menu, Search, User } from "lucide-react";
import PropTypes from "prop-types";
import {
  Leaf,
  Thermometer,
  Droplet,
  FlaskRound,
  Calendar,
  Ruler,
  Sprout,
  Zap,
  Bug,
  Worm,
  Clock,
  BarChart2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCropDetails } from "./GeminiCropAPI"; // Import the GetCropDetails function
import { useLocation } from "react-router-dom";

const CropDetails = ({ cropNameRecieved, cropImageRecieved }) => {
  const location = useLocation();
  const { cropNames, imageUrls } = location.state || {}; // Safely destructure the state

  const [cropName, setCropName] = useState(cropNames || "Wheat");
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cropImage, setCropImage] = useState(
    imageUrls ||
      "https://images.unsplash.com/photo-1600626336477-96e4ee89a052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8V2hlYXR8ZW58MHx8fHwxNzMzMDY4MTIyfDA&ixlib=rb-4.0.3&q=80&w=1080"
  ); // Default image

  useEffect(() => {
    const fetchCropDetails = async () => {
      try {
        const response = await GetCropDetails(cropName);
        const sanitizedResponse = response.replace(/```json|```/g, ""); // Remove backticks
        setCrop(JSON.parse(sanitizedResponse));
      } catch (err) {
        console.error("Error fetching crop details:", err);
        setError("Failed to fetch crop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCropDetails();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading crop details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-12">{error}</div>;
  }

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
      return (
        data.results?.[1]?.image ||
        "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg"
      ); // Return the image URL or a placeholder
    } catch (error) {
      console.error(`Error fetching image for ${cropName}:`, error);
      return "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg"; // Return placeholder on error
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await GetCropDetails(cropName);
      setCrop(JSON.parse(response)); // Ensure it's parsed if returning as a string
      const image = await fetchCropImage(cropName);
      setCropImage(image);
    } catch (err) {
      console.error("Error fetching crop details:", err);
      setError("Failed to fetch crop details.");
      setCrop(null);
    } finally {
      setLoading(false);
    }
  };

  CropDetails.propTypes = {
    initialCrop: PropTypes.string, // Accepts an initial crop name as a prop
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative mb-4 flex justify-end items-center">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          placeholder="Enter crop name..."
          className="w-[160px] rounded-md border border-gray-300 py-2 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00CBA9] sm:w-[200px] bg-transparent"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 rounded-md bg-[#00CBA9] text-white text-sm font-medium hover:bg-[#00B195] focus:outline-none focus:ring-2 focus:ring-[#00CBA9]"
        >
          Search
        </button>
      </div>
      <div className="max-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-48 w-full object-cover md:h-full md:w-48"
              alt={crop.crop.name}
              src={cropImage}
            />
          </div>
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
                {crop.crop.name}
              </CardTitle>
              <p className="text-center text-gray-500 italic text-sm sm:text-base">
                {crop.crop.scientificName}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Section
                  title="Growth Requirements"
                  icon={<Leaf className="h-6 w-6" />}
                >
                  <DetailItem
                    icon={<Thermometer />}
                    label="Climate"
                    value={crop.crop.growthRequirements.climate}
                  />
                  <DetailItem
                    icon={<Thermometer />}
                    label="Temperature"
                    value={crop.crop.growthRequirements.temperature}
                  />
                  <DetailItem
                    icon={<Droplet />}
                    label="Soil Type"
                    value={crop.crop.growthRequirements.soilType}
                  />
                  <DetailItem
                    icon={<FlaskRound />}
                    label="pH Level"
                    value={crop.crop.growthRequirements.pHLevel}
                  />
                  <DetailItem
                    icon={<Droplet />}
                    label="Water Requirement"
                    value={crop.crop.growthRequirements.waterRequirement}
                  />
                </Section>

                <Section
                  title="Planting Details"
                  icon={<Sprout className="h-6 w-6" />}
                >
                  <DetailItem
                    icon={<Calendar />}
                    label="Sowing Season"
                    value={crop.crop.plantingDetails.sowingSeason}
                  />
                  <DetailItem
                    icon={<Sprout />}
                    label="Seed Rate"
                    value={crop.crop.plantingDetails.seedRate}
                  />
                  <DetailItem
                    icon={<Ruler />}
                    label="Row Spacing"
                    value={crop.crop.plantingDetails.spacing.rowSpacing}
                  />
                  <DetailItem
                    icon={<Ruler />}
                    label="Plant Spacing"
                    value={crop.crop.plantingDetails.spacing.plantSpacing}
                  />
                  <DetailItem
                    icon={<Sprout />}
                    label="Propagation Method"
                    value={crop.crop.plantingDetails.propagationMethod}
                  />
                </Section>

                <Section
                  title="Fertilizer Requirements"
                  icon={<Zap className="h-6 w-6" />}
                >
                  <DetailItem
                    icon={<Zap />}
                    label="Nitrogen"
                    value={crop.crop.fertilizerRequirements.nitrogen}
                  />
                  <DetailItem
                    icon={<Zap />}
                    label="Phosphorus"
                    value={crop.crop.fertilizerRequirements.phosphorus}
                  />
                  <DetailItem
                    icon={<Zap />}
                    label="Potassium"
                    value={crop.crop.fertilizerRequirements.potassium}
                  />
                </Section>

                <Section
                  title="Pest and Disease Management"
                  icon={<Bug className="h-6 w-6" />}
                >
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Common Pests:
                  </h3>
                  <ul className="list-disc list-inside mb-4 text-sm sm:text-base">
                    {crop.crop.pestAndDiseaseManagement.commonPests.map(
                      (pest, index) => (
                        <li key={index} className="flex items-center mb-1">
                          <Bug className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
                          <span>{pest}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Common Diseases:
                  </h3>
                  <ul className="list-disc list-inside text-sm sm:text-base">
                    {crop.crop.pestAndDiseaseManagement.commonDiseases.map(
                      (disease, index) => (
                        <li key={index} className="flex items-center mb-1">
                          <Worm className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
                          <span>{disease}</span>
                        </li>
                      )
                    )}
                  </ul>
                </Section>

                <Section
                  title="Harvest Information"
                  icon={<Clock className="h-6 w-6" />}
                >
                  <DetailItem
                    icon={<Clock />}
                    label="Harvest Time"
                    value={crop.crop.harvestTime}
                  />
                  <DetailItem
                    icon={<BarChart2 />}
                    label="Yield Estimate"
                    value={crop.crop.yieldEstimate}
                  />
                </Section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="mb-6">
    <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    {children}
  </div>
);

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start mb-2 text-sm sm:text-base">
    {React.cloneElement(icon, {
      className: "h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0",
    })}
    <div className="flex-grow">
      <span className="font-medium mr-2">{label}:</span>
      <span className="text-gray-700">{value}</span>
    </div>
  </div>
);

export default CropDetails;

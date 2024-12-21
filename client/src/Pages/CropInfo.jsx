import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";

const CropInfo = () => {
  const navigate = useNavigate();

  const handleGetInfo = () => {
    navigate("/cropDetail");
  };

  return (
    <Card className="w-full bg-emerald-100  text-[#4A3933] shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-[#8B6E4E]" />
          Crop Information
        </CardTitle>
        <CardDescription className="text-[#6B5750]">
          Essential details for healthier and more productive crops
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="space-y-3 flex-grow">
          <p className="text-sm sm:text-base text-[#4A3933]">
            Get essential details about the crop you're growing, including ideal
            conditions, care tips, and ways to enhance yield. This feature helps
            you make informed decisions for healthier and more productive crops.
          </p>
          <Button
            className="bg-emerald-400 text-white hover:bg-[#6B5750] transition-colors"
            onClick={handleGetInfo}
          >
            Get Info
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1600626336477-96e4ee89a052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8V2hlYXR8ZW58MHx8fHwxNzMzMDY4MTIyfDA&ixlib=rb-4.0.3&q=80&w=1080?height=100&width=100"
            alt="Crop Information"
            className="w-24 h-24 object-cover rounded-full border-4 border-emerald-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CropInfo;

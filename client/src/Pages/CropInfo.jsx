import React from 'react';
import { Button } from "@/components/ui/button"

const CropInfo = () => {
  return (
    <div className="relative rounded-lg bg-[#E6E6FA] p-4 sm:p-8">
      <div className="max-w-2xl space-y-3 sm:space-y-4  place-items-start">
        <h2 className="text-lg font-semibold text-gray-900 sm:text-2xl text-left">Crop Information</h2>
        <p className="text-sm text-gray-600 sm:text-base text-left">
          Get essential details about the crop you're growing, including ideal conditions, care tips, and
          ways to enhance yield. This feature helps you make informed decisions for healthier and
          more productive crops.
        </p>
        <Button className="bg-[#6B5ECD] text-white hover:bg-[#6B5ECD]/90">
          Get Info
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
      </div>
    </div>
  );
};

export default CropInfo;


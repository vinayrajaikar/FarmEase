import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useNavigate} from 'react-router-dom';

const Navbbar = () => {
    const navigate = useNavigate();

  const handleAvatarClick = () => {
    // Navigate to supplier-home or supplier-profile based on some logic
    // For simplicity, we'll toggle between the two routes for now
    navigate('/supplier-profile'); // Change to '/supplier-home' as needed
  };
  return (
    <nav >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <p className="font-bold text-black  text-xl">FarmEase</p>
          </div>
          <div className="flex">
            <Link to="/supplier-home" className="px-3 py-2 text-black mr-4  rounded-md text-sm font-medium hover:text-green-700">Find Farmers</Link>
            <div className="flex items-center">
            <div className="flex items-center" onClick={handleAvatarClick}>
              <Avatar className="h-8 w-8 border-2 border-white">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Supplier" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
            </div>
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbbar;


import React, { useEffect, useState } from 'react';
import { Search, User, MapPin, Phone, Mail, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useDispatch } from 'react-redux';
import axiosInstance from '@/utils/axiosInstance';

const FarmerListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('fullName');
  const dispatch=useDispatch();
 
  const [farmers, setFarmers] = useState([]);

  const filteredFarmers = farmers
    .filter(farmer =>
      farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.area.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

  const getAllFarmer=async()=>{
    const response = await axiosInstance.get("/supplier/get-all-farmers");
    console.log(response.data.data);
    setFarmers(response.data.data);
  }

  useEffect(() => {
    getAllFarmer();
  },[])

  return (
    <div className="max-w-6xl mx-auto">
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search and Sort Farmers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search farmers by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4 text-gray-500" />}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Sort By <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('fullName')}>Full Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('area')}>Area</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarmers.map(farmer => (
          <Card key={farmer._id} className="overflow-hidden">
            <CardHeader className="bg-teal-300 text-white p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={farmer.coverImage || `/placeholder.svg?height=48&width=48&text=${farmer.fullName.charAt(0)}`} alt={farmer.fullName} />
                  <AvatarFallback>{farmer.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{farmer.fullName}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <InfoItem icon={<MapPin />} label="Area" value={farmer.area} />
                <InfoItem icon={<Mail />} label="Email" value={farmer.email} />
                <InfoItem icon={<Phone />} label="Phone" value={farmer.contactNumber} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <div className="text-green-600">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default FarmerListing;

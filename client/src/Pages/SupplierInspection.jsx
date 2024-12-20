import React, { useEffect, useState } from 'react';
import { User, MapPin, Phone, Mail, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from 'react-redux';
import { getCurrentSupplier } from "../Redux/Slices/supplierSlice";

const SupplierInspection = () => {
  const dispatch = useDispatch();
  const [supplierProfile, setSupplierProfile] = useState({
    username: "",
    fullName: "",
    area: "",
    contactNumber: "",
    email: "",
    supplyCategory: "Seeds, Fertilizers",
    description: " "
  });

  const fetchSupplierProfile = async () => {
    const response = await dispatch(getCurrentSupplier());
    console.log(response.payload.data)
    setSupplierProfile(response.payload.data);
  };

  useEffect(() => {
    fetchSupplierProfile();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-4">
      <Card className="overflow-hidden">
        <CardHeader className="bg-teal-300 text-white p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={supplierProfile.fullName} />
              <AvatarFallback className='text-black'>{supplierProfile.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl mb-1">{supplierProfile.fullName}</CardTitle>
              <p className="text-green-100">@{supplierProfile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<User />} label="Username" value={supplierProfile.username} />
              <InfoItem icon={<MapPin />} label="Area" value={supplierProfile.area} />
              <InfoItem icon={<Phone />} label="ContactNumber" value={supplierProfile.contactNumber} />
              <InfoItem icon={<Mail />} label="Email" value={supplierProfile.email} />
              <InfoItem icon={<Package />} label="Supply Category" value={supplierProfile.supplyCategory} />
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <FileText className="mr-2" /> Description
              </h3>
              <p className="text-gray-600">{supplierProfile.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
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

export default SupplierInspection;

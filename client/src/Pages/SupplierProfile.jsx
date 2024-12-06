import React, { useState } from 'react';
import { Edit, Save, X, User, MapPin, Phone, Mail, Package, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const SupplierProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [supplierProfile, setSupplierProfile] = useState({
    username: "green_supplier",
    fullName: "Green Grow Supplies",
    location: "California",
    phone: "+1 123-456-7890",
    email: "contact@greengrow.com",
    supplyCategory: "Seeds and Fertilizers",
    description: "We provide high-quality seeds and fertilizers for all your farming needs. Our products are sourced from the best manufacturers and are designed to improve crop yield and quality. With years of experience in the agricultural industry, we understand the unique needs of farmers and strive to offer personalized solutions."
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the updated profile to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any unsaved changes
    //Handles Cancel while editing
    
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-teal-300 text-white p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 border-4 border-white">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={supplierProfile.fullName} />
              <AvatarFallback>{supplierProfile.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl mb-1">{supplierProfile.fullName}</CardTitle>
              <p className="text-green-100">@{supplierProfile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {!isEditing && (
            <Button onClick={handleEdit} variant="outline" size="sm" className="mb-4">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="username"
                  value={supplierProfile.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
                <Input
                  name="fullName"
                  value={supplierProfile.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                <Input
                  name="location"
                  value={supplierProfile.location}
                  onChange={handleChange}
                  placeholder="Location"
                />
                <Input
                  name="phone"
                  value={supplierProfile.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
                <Input
                  name="email"
                  value={supplierProfile.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                />
                <Select 
                  name="supplyCategory"
                  value={supplierProfile.supplyCategory} 
                  onValueChange={(value) => handleChange({ target: { name: 'supplyCategory', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supply category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Seeds">Seeds</SelectItem>
                    <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                    <SelectItem value="Pesticides">Pesticides</SelectItem>
                    <SelectItem value="Farm Equipment">Farm Equipment</SelectItem>
                    <SelectItem value="Seeds and Fertilizers">Seeds and Fertilizers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                name="description"
                value={supplierProfile.description}
                onChange={handleChange}
                placeholder="Company Description"
                rows={4}
              />
              <div className="flex justify-end space-x-2">
                <Button onClick={handleCancel} variant="outline">Cancel</Button>
                <Button onClick={handleSave} variant="primary"  className="bg-teal-200 text-black">Save Changes</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={<User />} label="Username" value={supplierProfile.username} />
                <InfoItem icon={<MapPin />} label="Location" value={supplierProfile.location} />
                <InfoItem icon={<Phone />} label="Phone" value={supplierProfile.phone} />
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
          )}
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

export default SupplierProfile;


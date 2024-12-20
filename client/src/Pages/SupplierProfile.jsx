import React, { useEffect, useState, useRef } from 'react';
import { Edit, Save, X, User, MapPin, Phone, Mail, Package, FileText, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useDispatch } from 'react-redux';
import { getCurrentSupplier, updateSupplierAccount, updateSupplierCoverImage } from "../Redux/Slices/supplierSlice"

const SupplierProfile = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [supplierProfile, setSupplierProfile] = useState({
    username: "",
    fullName: "",
    area: "",
    contactNumber: "",
    email: "",
    supplyCategory: "",
    description: "",
    coverImage: "",
  });

  const [profileImage, setprofileImage] = useState(null);


  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const res = await dispatch(updateSupplierAccount(supplierProfile));

    if (fileInputRef.current.files[0]) {
      const formdata = new FormData();
      formdata.append("coverImage", fileInputRef.current.files[0]);
      const response = await dispatch(updateSupplierCoverImage(formdata));
      // console.log(response.payload.data);
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const fetchSupplierProfile = async () => {
    const response = await dispatch(getCurrentSupplier());
    console.log(response.payload.data);
    setSupplierProfile(response.payload.data)
  }

  useEffect(() => {
    fetchSupplierProfile();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSupplierProfile((prev) => ({...prev, coverImage: e.target.result}));
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="bg-teal-300 text-white p-6">
          <div className="flex items-center space-x-4 relative"  >
            <Avatar className="h-24 w-24 border-4 border-white" onClick={isEditing ?() => fileInputRef.current.click():null}>
              <AvatarImage src={supplierProfile.coverImage} alt={supplierProfile.fullName} />
              <AvatarFallback>{supplierProfile.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div>
              <CardTitle className="text-2xl mb-1">{supplierProfile.fullName}</CardTitle>
              <p className="text-green-100">{supplierProfile.username}</p>
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
                  name="area"
                  value={supplierProfile.area}
                  onChange={handleChange}
                  placeholder="Area"
                />
                <Input
                  name="contactNumber"
                  value={supplierProfile.contactNumber}
                  onChange={handleChange}
                  placeholder="ContactNumber"
                />
                <Input
                  name="email"
                  value={supplierProfile.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                />
                <Select 
                  onValueChange={(value) => 
                    setSupplierProfile((prev) => ({ ...prev, supplyCategory: value }))
                  }
                  value={supplierProfile.supplyCategory}
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
                <Button onClick={handleSave} variant="primary" className="bg-teal-200 text-black">Save Changes</Button>
              </div>
            </div>
          ) : (
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


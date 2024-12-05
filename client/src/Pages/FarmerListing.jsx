import React, { useState } from 'react';
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
} from "@/components/ui/dropdown-menu"

const FarmerListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Mock data for demonstration
  const farmers = [
    { id: 1, name: "John Doe", location: "Midwest", email: "john@example.com", phone: "+1 234-567-8901" },
    { id: 2, name: "Jane Smith", location: "California", email: "jane@example.com", phone: "+1 345-678-9012" },
    { id: 3, name: "Bob Johnson", location: "Texas", email: "bob@example.com", phone: "+1 456-789-0123" },
    { id: 4, name: "Alice Brown", location: "Oregon", email: "alice@example.com", phone: "+1 567-890-1234" },
    { id: 5, name: "Charlie Davis", location: "Florida", email: "charlie@example.com", phone: "+1 678-901-2345" },
    { id: 6, name: "Eva Wilson", location: "New York", email: "eva@example.com", phone: "+1 789-012-3456" },
  ];

  const filteredFarmers = farmers
    .filter(farmer => 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));

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
                <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('location')}>Location</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFarmers.map(farmer => (
          <Card key={farmer.id} className="overflow-hidden">
            <CardHeader className="bg-teal-300 text-white p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${farmer.name.charAt(0)}`} alt={farmer.name} />
                  <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{farmer.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                <InfoItem icon={<MapPin />} label="Location" value={farmer.location} />
                <InfoItem icon={<Mail />} label="Email" value={farmer.email} />
                <InfoItem icon={<Phone />} label="Phone" value={farmer.phone} />
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


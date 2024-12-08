import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Tag } from "lucide-react";
import { getAllSuppliers } from "../Redux/Slices/farmerSlice";
import { useDispatch } from "react-redux";

function SupplierDirectory() {
  const dispatch = useDispatch();

  // Make `suppliers` a state variable
  const [suppliers, setSuppliers] = useState([]);

  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleFilter = () => {
    const filtered = suppliers.filter(
      (supplier) =>
        (locationFilter === "" ||
          supplier.area.toLowerCase().includes(locationFilter.toLowerCase())) &&
        (typeFilter === "all" || supplier.supplyCategory === typeFilter)
    );
    setFilteredSuppliers(filtered);
  };

  const fetchAllSuppliers = async () => {
    const response = await dispatch(getAllSuppliers());
    if (response.payload) {
      setSuppliers(response.payload);
      setFilteredSuppliers(response.payload); 
    }
    console.log(response.payload);
  };

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="bg-transparent border-0 shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label
                htmlFor="location-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <Input
                id="location-filter"
                placeholder="Filter by location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="sm:w-[180px]">
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier Type
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger id="type-filter" className="w-full">
                  <SelectValue placeholder="Supplier type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:self-end">
              <Button
                onClick={handleFilter}
                className="w-full sm:w-auto bg-[#6EE7B7] text-gray-800 hover:bg-[#6EE7B7]/80 transition-colors"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card
            key={supplier.id}
            className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          >
            <CardHeader className="bg-[#6EE7B7]/10 border-b border-[#6EE7B7]">
              <CardTitle className="text-xl text-gray-800">
                {supplier.username}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">
                  Type: {supplier.supplyCategory}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{supplier.area}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">{supplier.contactNumber}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-500" />
                <a
                  href={`mailto:${supplier.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {supplier.email}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SupplierDirectory;

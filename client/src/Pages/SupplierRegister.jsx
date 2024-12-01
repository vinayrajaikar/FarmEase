import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';


const InputField = ({ label, name, type = "text", placeholder, minLength, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <input
      id={name}
      name={name}
      type={type}
      className="w-full px-6 py-2 text-xs bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pt-7"
      placeholder={placeholder}
      minLength={minLength}
      required
      value={value}
      onChange={onChange}
    />
    <label
      htmlFor={name}
      className="absolute left-6 top-2 text-sm font-bold text-gray-500"
    >
      {label}
    </label>
  </div>
);

const SelectField = ({ label, name, options, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      id={name}
      name={name}
      className="w-full px-6 py-2 text-xs bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pt-7 appearance-none"
      required
      value={value}
      onChange={onChange}
    >
      <option value=""  disabled>Select a category</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    <label
      htmlFor={name}
      className="absolute left-6 top-2 text-sm font-bold text-gray-500"
    >
      {label}
    </label>
  </div>
);

const TextAreaField = ({ label, name, placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <textarea
      id={name}
      name={name}
      className="w-full px-6 py-2 text-xs bg-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pt-10 min-h-[120px]"
      placeholder={placeholder}
      required
      value={value}
      onChange={onChange}
    />
    <label
      htmlFor={name}
      className="absolute left-6 top-2 text-sm font-bold text-gray-500"
    >
      {label}
    </label>
  </div>
);

export default function SupplierRegistration() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    fullName: '',
    contactNumber: '',
    pincode: '',
    password: '',
    supplyCategory: '',
    description: ''
  });
  const [avatarSrc, setAvatarSrc] = useState('/placeholder.svg');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Allow only numeric input for "contactNumber"
    if (name === "contactNumber") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }
  
    // For other fields, update as usual
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/'); // Navigate back to the SignIn page
  };

  const supplyCategories = ['Seeds','Fertilizers'];

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4 md:p-8 gap-8">
        <div className="space-y-6 flex-1">
          <h1 className="text-2xl text-left font-semibold text-gray-800">New supplier registration</h1>
          
          <div className="flex justify-center md:justify-start">
            <div className="relative w-24 h-24 cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-full h-full rounded-full overflow-hidden">
              <Avatar className="relative inline-block w-24 h-24">
              <AvatarImage
                src={avatarSrc || "https://github.com/shadcn.png"}
                alt="Profile picture"
                className="w-full h-full object-cover rounded-full"
              />
              
              <AvatarFallback className="absolute inset-0 flex items-center justify-center bg-cover bg-center bg-[url('https://github.com/shadcn.png')] text-white font-bold text-sm rounded-full">
                Add Image
              </AvatarFallback>
            </Avatar>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="User Name"
              name="userName"
              placeholder="Minimum four characters"
              minLength={4}
              value={formData.userName}
              onChange={handleChange}
            />
            <InputField
              label="Full Name"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Contact Number"
              name="contactNumber"
              type="tel"
              placeholder="Your contact number"
              pattern="[0-9]*"
              inputMode="numeric"
              value={formData.contactNumber}
              onChange={handleChange}
            />
            <div className="relative">
              <input
                id="pincode"
                name="pincode"
                type="text"
                className="w-full px-6 py-2 text-xs bg-green-500 text-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pt-7 placeholder-white placeholder-opacity-80"
                placeholder="Required field"
                required
                value={formData.pincode}
                onChange={handleChange}
              />
              <label
                htmlFor="pincode"
                className="absolute left-6 top-2 text-sm font-bold text-white"
              >
                Location
              </label>
            </div>
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum eight characters"
              minLength={8}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectField
              label="Supply Category"
              name="supplyCategory"
              options={supplyCategories}
              value={formData.supplyCategory}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                name="description"
                placeholder="Describe your supplies..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button onClick={handleCancel} type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Register
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
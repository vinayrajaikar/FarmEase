import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerFarmer } from "../Redux/Slices/farmerSlice";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  minLength,
  value,
  onChange,
  className = "",
}) => (
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

export default function FarmerRegistration() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, status } = useSelector((state) => state.farmer);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    contactNumber: "",
    area: "",
    password: "",
    coverImage:""
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg");
  const fileInputRef = useRef(null);

  const handleCancel = () => {
    navigate("/"); // Navigate back to the SignIn page
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data object to send
    const payload = {
      username: formData.username,
      fullName: formData.fullName,
      email: formData.email,
      contactNumber: formData.contactNumber,
      area: formData.area,
      password: formData.password,
      coverImage: avatar || ""  // If no avatar is selected, send an empty string
    };

    // Logging the payload
    console.log("Payload:", payload);

    // Dispatching the action
    dispatch(registerFarmer(payload))
      .unwrap()
      .then(() => {
        alert("Farmer registered successfully!");
        navigate("/"); // Redirect after successful registration
      })
      .catch((error) => {
        console.error("Error registering farmer:", error);
        alert("Registration failed. Please try again.");
      });
};





  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numeric input for "phone"
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarSrc(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4 md:p-8 gap-8">
        <div className="space-y-6 flex-1">
          <h1 className="text-2xl text-left font-semibold text-gray-800">
            New farmer registration
          </h1>

          <div className="flex justify-center md:justify-start">
            <div
              className="relative w-24 h-24 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="User Name"
                name="username"
                placeholder="Minimum four characters"
                minLength={4}
                value={formData.username}
                onChange={handleChange}
              />
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Minimum four characters"
                minLength={4}
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Use company email address"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone"
                name="contactNumber"
                type="tel"
                placeholder="Required field cannot be empty"
                pattern="[0-9]*"
                inputMode="numeric"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              <div className="relative">
                <input
                  id="pincode"
                  name="area"
                  type="text"
                  className="w-full px-6 py-2 text-xs bg-green-500 text-white border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent pt-7 placeholder-white placeholder-opacity-80"
                  placeholder="Required field cannot be empty"
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

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

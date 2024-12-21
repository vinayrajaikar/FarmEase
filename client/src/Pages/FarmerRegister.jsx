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
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.farmer);

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    contactNumber: "",
    area: "",
    password: "",
  });

  const [coverImage, setcoverImage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setcoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to the home page
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("username", formData.username);
    payload.append("fullName", formData.fullName);
    payload.append("email", formData.email);
    payload.append("contactNumber", formData.contactNumber);
    payload.append("area", formData.area);
    payload.append("password", formData.password);

    if (fileInputRef.current.files[0]) {
      payload.append("coverImage", fileInputRef.current.files[0]);
    }
    else{
      payload.append("coverImage", "");
    }

    dispatch(registerFarmer(payload))
      .unwrap()
      .then(() => {
        alert("Farmer registered successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error registering farmer:", error);
        alert("Registration failed. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto p-4 md:p-8 gap-8">
        <div className="space-y-6 flex-1">
          <h1 className="text-2xl text-left font-semibold text-gray-800">
            New Farmer Registration
          </h1>

          <div className="flex justify-center md:justify-start">
            <div
              className="relative w-24 h-24 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <Avatar className="relative inline-block w-24 h-24">
                <AvatarImage
                  src={coverImage}
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
                placeholder="Add Profile Picture"
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
                value={formData.contactNumber}
                onChange={handleChange}
              />
              <InputField
                label="Location"
                name="area"
                placeholder="Required field cannot be empty"
                value={formData.area}
                onChange={handleChange}
              />
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
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600"
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

import React, { useState, useRef } from "react";
import { Edit2 } from "lucide-react";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "5551234567",
    address: "belgaum",
    password: "Password",
    userType: "farmer",
    supplyType: "Organic Produce",
    description: "We specialize in delivering fresh, organic produce directly from our farm to your table.",
    avatar: "https://github.com/shadcn.png",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({
          ...prevData,
          avatar: reader.result,
        }));
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated user data:", userData);
    console.log("Avatar file to upload:", avatarFile);
    setIsEditing(false);
  };

  const supplyCategories = ["Seeds", "Fertilizers"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: name === "phone" ? value.replace(/\D/g, "") : value, // Restrict phone to numbers only
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="justify-start">
              
            </div>
      <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            <div className="h-48 w-full md:h-full md:w-48 flex items-center justify-center relative">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-white"
                src={userData.avatar}
                alt={userData.name}
                onClick={isEditing ? () => fileInputRef.current.click() : () => {}}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center bg-transparent text-gray-500"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="text"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                  />
                </div>

                {userData.userType === "supplier" && (
                  <>
                    <div>
                      <label className="block text-sm text-left font-medium text-gray-700">
                        Supply Type
                      </label>
                      <select
                        name="supplyType"
                        value={userData.supplyType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {supplyCategories.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-left font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={userData.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

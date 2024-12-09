import React, { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentFarmer, updateFarmerAccount, updateFarmerCoverImage } from "../Redux/Slices/farmerSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    fullName: "",
    email: "",
    contactNumber: "",
    area: "",
    coverImage: "",
    supplyType: "",
    description: "",
  });
  const [coverImage, setcoverImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      const response = await dispatch(getCurrentFarmer());
      if (response?.payload?.data) {
        setUserData(response.payload.data);
      }
    };
    fetchFarmerDetails();
  }, []); // Only run when the component mounts

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("coverImage", file); // Match this key with your backend's expected field name
      try {
        const response = await dispatch(updateFarmerCoverImage(formData));
        console.log("Upload successful:", response);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      updateFarmerAccount({
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        contactNumber: userData.contactNumber,
        area: userData.area,
      })
    );
    setIsEditing(false);
  };

  const supplyCategories = ["Seeds", "Fertilizers"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: name === "contactNumber" ? value.replace(/\D/g, "") : value, // Restrict contactNumber to numbers only
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0">
            <div className="h-48 w-full md:h-full md:w-48 flex items-center justify-center relative">
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-white"
                src={userData.coverImage}
                alt="Profile"
                onClick={isEditing ? () => fileInputRef.current.click() : undefined}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{userData.username}</h1>
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
                {/* Input fields */}
                {["fullName", "email", "contactNumber", "username", "area"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-left font-medium text-gray-700 capitalize">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={userData[field] || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                    />
                  </div>
                ))}
                {/* Supply Type and Description for suppliers */}
                {userData.userType === "supplier" && (
                  <>
                    <div>
                      <label className="block text-sm text-left font-medium text-gray-700">
                        Supply Type
                      </label>
                      <select
                        name="supplyType"
                        value={userData.supplyType || ""}
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
                        value={userData.description || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-4 px-4 my-2"
                      ></textarea>
                    </div>
                  </>
                )}
              </div>
              {/* Save Button */}
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

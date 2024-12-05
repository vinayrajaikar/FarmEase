import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFarmer } from '../Redux/Slices/farmerSlice';
import { loginSupplier } from '../Redux/Slices/supplierSlice';

const InputField = ({ label, name, type = "text", placeholder, value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <input
      id={name}
      name={name}
      type={type}
      className="w-full px-6 py-2 text-xs bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pt-7"
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

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.farmer.loading);
  // const farmerDetails = useSelector((state) => state.farmer.farmerDetails);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let response;
  
      // Try logging in as a farmer
      response = await dispatch(
        loginFarmer({
          email: formData.email,
          password: formData.password,
        })
      );
  
      if (response.payload?.data?.user.role === "farmer") {
        console.log("Logged in as Farmer:", response.payload.data.user);
        navigate("/home");
        return;
      }
  
      // If not a farmer, try logging in as a supplier
      response = await dispatch(
        loginSupplier({
          email: formData.email,
          password: formData.password,
        })
      );
      console.log(response.payload.data.role);
  
      if (response.payload?.data?.role === "supplier") {
        console.log("Logged in as Supplier:", response.payload.data);
        navigate("/suppliers");
        return;
      }
  
      // If neither role is valid
      setError("Invalid email or password");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">Sign In</h1>

          

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Don't have an account yet?</p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/farmer-registration"
                className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-full hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Register as Farmer
              </Link>
              <Link
                to="/supplier-registration"
                className="px-4 py-2 text-sm font-medium text-green-600 bg-white border border-green-600 rounded-full hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Register as Supplier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

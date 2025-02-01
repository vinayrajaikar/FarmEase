import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import FarmerRegistration from "./Pages/FarmerRegister";
import SupplierRegistration from "./Pages/SupplierRegister";
import SignIn from "./Pages/SignIn";
import HomePage from "./Pages/HomePage";
import NavBar from "./components/ui/NavBar";
import SupplierDirectory from "./Pages/SuppliersPage";
import NewsPage from "./Pages/NewsPage";
import DiseaseDetector from "./Pages/DiseaseDetector";
import FarmerProfile from "./Pages/FarmerProfile";
import CropDetails from "./Pages/CropDetailPage";
import FarmerListing from "./Pages/FarmerListing";
import SupplierNavBar from "./components/ui/SupplierNavBar";
import SupplierProfile from "./Pages/SupplierProfile";
import SupplierInspection from "./Pages/SupplierInspection";
import Auth from "./Auth";

function AppContent() {
  const location = useLocation();

  // List of routes where NavBar should be hidden
  const hiddenNavBarRoutes = [
    "/",
    "/farmer-registration",
    "/supplier-registration",
    "/supplier-home",
    "/supplier-profile",
  ];

  const supplierRoutes = ["/supplier-home", "/supplier-profile"];

  return (
    <div className="App sm:mx-16">
      {/* Conditionally render NavBar */}
      {!hiddenNavBarRoutes.includes(location.pathname) && <NavBar />}
      {supplierRoutes.includes(location.pathname) && <SupplierNavBar />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={
          <Auth allowedRoles={["farmer"]}>  
            <HomePage />
          </Auth>
          } />
        <Route path="/farmer-registration" element={<FarmerRegistration />} />
        <Route path="/supplier-registration" element={<SupplierRegistration />} />
        <Route path="/suppliers" element={
          <Auth allowedRoles={["farmer"]}>
            <SupplierDirectory />
          </Auth>
        } />
          
        <Route path="/farmers" element={<FarmerListing />} />

        <Route path="/news" element={
          <Auth allowedRoles={["farmer"]}>
          <NewsPage />
          </Auth>
        } />
          
        <Route path="/disease-detection" element={
          <Auth allowedRoles={["farmer"]}>
            <DiseaseDetector />
          </Auth>
        } />

        <Route path="/farmer-profile" element={
          <Auth allowedRoles={["farmer"]}>
            <FarmerProfile />
          </Auth>
        } />

        <Route path="/cropdetail" element={
          <Auth allowedRoles={["farmer"]}>
            <CropDetails />
          </Auth>
        } />

        <Route path="/supplier-home" element={
          <Auth allowedRoles={["supplier"]}>
            <FarmerListing />
          </Auth>
          } />

        <Route path="/supplier-profile" element={
          <Auth allowedRoles={["supplier"]}>
            <SupplierProfile />
          </Auth>
          } />

        <Route path="/supplier-inspection/:supplierId" element={
          <Auth allowedRoles={["supplier"]}>
            <SupplierInspection />
          </Auth>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

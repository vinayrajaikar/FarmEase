import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FarmerRegistration from './Pages/FarmerRegister';
import SupplierRegistration from './Pages/SupplierRegister';
import SignIn from './Pages/SignIn';
import HomePage from './Pages/HomePage';
import NavBar from './components/ui/NavBar';
import SupplierDirectory from './Pages/SuppliersPage';
import NewsPage from './Pages/NewsPage';
import DiseaseDetector from './Pages/DiseaseDetector';
import ProfilePage from './Pages/ProfilePage';

function AppContent() {
  const location = useLocation();

  // List of routes where NavBar should be hidden
  const hiddenNavBarRoutes = ['/', '/farmer-registration', '/supplier-registration'];

  return (
    <div className="App">
      {/* Conditionally render NavBar */}
      {!hiddenNavBarRoutes.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/farmer-registration" element={<FarmerRegistration />} />
        <Route path="/supplier-registration" element={<SupplierRegistration />} />
        <Route path="/suppliers" element={<SupplierDirectory/>} />
        <Route path="/news" element={<NewsPage/>} />
        <Route path="/disease-detection" element={<DiseaseDetector/>} />
        <Route path="/profile" element={<ProfilePage/>} />
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

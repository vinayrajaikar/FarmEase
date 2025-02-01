import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "./useAuth"; // Import the helper function

const Auth = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in first!");
      navigate("/");
      return;
    }

    if (!allowedRoles.includes(role)) {
      toast.error("Access Denied!");
      navigate("/home");
    }
  }, [isAuthenticated, role, allowedRoles, navigate]);

  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return null; // Prevent unauthorized page rendering
  }

  return children;
};

export default Auth;

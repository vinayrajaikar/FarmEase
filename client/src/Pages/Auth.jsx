import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Auth({ children, authentication, allowedRoles }) {
  const navigate = useNavigate();
//   const authStatus = useSelector((state) => state.auth.status);
  let accountType = useSelector((state) => state.auth.accountType);
  accountType === null ? (accountType = "all") : accountType;

  useEffect(() => {
    if (!authentication && authStatus !== authentication) {
      return;
    }

    if (authStatus && !allowedRoles.includes(accountType)) {
      toast.error("You lost your way!");
      navigate("/");
    }
  }, [authStatus, authentication, navigate, allowedRoles, accountType]);

  if (authentication && authStatus !== authentication) {
    navigate("/");
  }

  return children;
}

export default Auth;
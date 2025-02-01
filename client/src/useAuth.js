import { useSelector } from "react-redux";

const useAuth = () => {
  const farmer = useSelector((state) => state.farmer);
  const supplier = useSelector((state) => state.supplier);
  console.log(farmer);
  console.log(supplier);
  if (farmer.status) {
    return { isAuthenticated: true, role: "farmer" };
  }
  if (supplier.status) {
    return { isAuthenticated: true, role: "supplier" };
  }
  return { isAuthenticated: false, role: null };
};

export default useAuth;
import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { loginFarmer,getCurrentFarmer } from './Redux/Slices/farmerSlice';

const App = () => {
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const [details,setdetails]=useState({})
  const farmerDetails = useSelector((state) => state.farmer.farmerDetails);
      // const farmerDetails = useSelector((state) => state.farmer.farmerDetails);
    const loading = useSelector((state) => state.farmer.loading);
    const status = useSelector((state) => state.farmer.status);
  
  
  // Function to log in and fetch user data
  async function login() {
    try {
      const response = await dispatch(
        loginFarmer({
          email: 'a@gmail.com',
          password: '123',
        })
      );
      console.log(response.payload.data.user); // Logs user data
      return response.payload.data.user; // Return user data
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  async function getFarmerDetails() {
    try {
      const response = await dispatch(getCurrentFarmer());
      console.log(response)
      console.log(response.payload.data); // Logs user data
      return response.payload.data; // Return user data
    } catch (error) {
      console.error('Error logging in:', error);
    }
  }

  // useEffect to call the login function and set data
  useEffect(() => {
    async function fetchData() {
      const userData = await login(); // Await resolved data
      const getdetails = await getFarmerDetails();
      if (userData) {
        setData(userData); // Set user data to state
      }
      if(getdetails){
        setdetails(getdetails)
      }
    }
    fetchData();
  }, []);



  return (
    <div>
      <h1>{JSON.stringify(data)}</h1>
      <h1>{JSON.stringify(details)}</h1>
      <h3>{JSON.stringify(farmerDetails)}</h3>
      <h5>Hackerrrrrr</h5>
    </div>
  );
};

export default App;
















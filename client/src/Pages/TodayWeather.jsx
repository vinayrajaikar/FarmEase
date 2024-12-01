import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  
  const TodayWeather = () => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
  
    const weatherIcons = {
      "01d": "https://cdn-icons-png.flaticon.com/128/5825/5825968.png",
      "01n": "https://cdn-icons-png.flaticon.com/128/5826/5826012.png",
      "02d": "https://cdn-icons-png.flaticon.com/128/5828/5828380.png",
      "02n": "https://cdn-icons-png.flaticon.com/128/2136/2136795.png",
      "03d": "https://cdn-icons-png.flaticon.com/128/5828/5828361.png",
      "03n": "https://cdn-icons-png.flaticon.com/128/5828/5828385.png",
      "04d": "https://cdn-icons-png.flaticon.com/128/9420/9420939.png",
      "04n": "https://cdn-icons-png.flaticon.com/128/9420/9420939.png",
      "09d": "https://cdn-icons-png.flaticon.com/128/9420/9420941.png",
      "09n": "https://cdn-icons-png.flaticon.com/128/9420/9420941.png",
      "10d": "https://cdn-icons-png.flaticon.com/128/7216/7216267.png",
      "10n": "https://cdn-icons-png.flaticon.com/128/7216/7216267.png",
      "11d": "https://cdn-icons-png.flaticon.com/128/9420/9420943.png",
      "11n": "https://cdn-icons-png.flaticon.com/128/9420/9420943.png",
      "13d": "https://cdn-icons-png.flaticon.com/128/5769/5769448.png",
      "13n": "https://cdn-icons-png.flaticon.com/128/5769/5769448.png",
      "50d": "https://cdn-icons-png.flaticon.com/128/9421/9421232.png",
      "50n": "https://cdn-icons-png.flaticon.com/128/9421/9421232.png",
    };
  
    const location = "Belgaum"; // Replace with dynamic location if needed
    const apiKey = "1af2d745ebd29c6c176f2e0ee06909e6"; // Replace with your OpenWeatherMap API key
  
    // Function to fetch current weather
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
        );
        setWeather(res.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        if (err.response) {
          setError(`${err.response.data.cod} ${err.response.data.message}`);
        } else {
          setError("An error occurred while fetching the weather data.");
        }
      }
    };
  
    useEffect(() => {
      fetchWeather();
    }, []);
  
    return (
      <div className="bg-[#C2F5EA] rounded-lg p-4 sm:p-6 w-full sm:w-fit h-44">
        {weather ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-left">
            {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long" }).format(new Date())}

            </p>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-4xl font-bold sm:text-4xl">
                  {weather.main.temp}°
                </div>
                <div className="text-lg font-bold text-left"> {weather.weather[0].main}</div>
                <div className="text-sm text-left">Humidity {weather.main.humidity}%</div>
              </div>
              <div className="text-yellow-500 px-6">
              <div className="relative" style={{ width: "64px", height: "64px" }}>
                <img 
                  src={weatherIcons[weather.weather[0].icon]}
                  alt={weather.weather[0].description}
                />
              </div>
            
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    );
  };
  
  export default TodayWeather;
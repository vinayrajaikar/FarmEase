import React, { useEffect, useState } from "react";
import axios from "axios";

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

const Forecast = () => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=Belgaum&appid=1af2d745ebd29c6c176f2e0ee06909e6&units=metric`
        );

        // Process forecast data
        const processedData = res.data.list
          .filter((entry) => {
            const date = new Date(entry.dt_txt);
            return date.getUTCHours() >= 9 && date.getUTCHours() < 12;
          })
          .map((entry) => {
            const date = new Date(entry.dt_txt);
            return {
              day: `${date.getUTCDate()} ${date.toLocaleString("default", {
                month: "short",
              })}`,
              time: `${date.getUTCHours() > 12 ? date.getUTCHours() - 12 : date.getUTCHours()}:${
                date.getUTCMinutes() < 10 ? "0" : ""
              }${date.getUTCMinutes()} ${
                date.getUTCHours() >= 12 ? "PM" : "AM"
              }`,
              temp: Math.round(entry.main.temp),
              icon: weatherIcons[entry.weather[0].icon],
            };
          });

        setForecastData(processedData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-4">
      {forecastData.length > 0 ? (
        forecastData.map((forecast, index) => (
          <div
            key={index}
            className="bg-[#C2F5EA] rounded-lg p-3 flex flex-col items-center justify-between sm:p-4 h-32 sm:h-44"
          >
            <p className="text-xs font-medium sm:text-sm">{forecast.day}</p>
            <img
              src={forecast.icon}
              alt="Weather Icon"
              className="my-2 h-8 w-8 sm:h-12 sm:w-12 object-contain"
            />
            <p className="text-base font-bold sm:text-lg">{forecast.temp}°</p>
          </div>
        ))
      ) : (
        <p className="col-span-5 text-center">Loading...</p>
      )}
    </div>
  );
};

export default Forecast;

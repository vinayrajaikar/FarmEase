"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [error, setError] = useState(null);

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
              time: `${
                date.getUTCHours() > 12
                  ? date.getUTCHours() - 12
                  : date.getUTCHours()
              }:${
                date.getUTCMinutes() < 10 ? "0" : ""
              }${date.getUTCMinutes()} ${
                date.getUTCHours() >= 12 ? "PM" : "AM"
              }`,
              temp: Math.round(entry.main.temp),
              icon: weatherIcons[entry.weather[0].icon],
              description: entry.weather[0].description,
            };
          });

        setForecastData(processedData);
        setError(null);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
        setError("Failed to fetch forecast data. Please try again later.");
      }
    };

    fetchForecast();
  }, []);

  return (
    <Card className="w-full text-[#4A3933]  shadow-none border-none  ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : forecastData.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {forecastData.map((forecast, index) => (
              <Card key={index} className="bg-emerald-200 shadow-md">
                <CardContent className="p-4 flex flex-col items-center justify-between h-full">
                  <p className="text-sm font-medium text-green-950">
                    {forecast.day}
                  </p>
                  <div className="my-2 flex flex-col items-center">
                    <img
                      src={forecast.icon}
                      alt={forecast.description}
                      className="h-12 w-12 object-contain"
                    />
                    <p className="text-xs text-center mt-1 text-green-950">
                      {forecast.description}
                    </p>
                  </div>
                  <p className="text-lg font-bold">{forecast.temp}°C</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="bg-emerald-100 shadow-md">
                <CardContent className="p-4 flex flex-col items-center justify-between h-full">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-16 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Forecast;

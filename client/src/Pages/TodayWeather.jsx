"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Cloud, Droplets, Thermometer } from "lucide-react";

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
    <Card className="w-full max-w-md mx-auto bg-emerald-200 text-green-950 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">{location}</CardTitle>
        <p className="text-sm text-green-950">
          {new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date())}
        </p>
      </CardHeader>
      <CardContent>
        {weather ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={weatherIcons[weather.weather[0].icon]}
                  alt={weather.weather[0].description}
                  className="w-16 h-16"
                />
                <div>
                  <p className="text-4xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p>{weather.weather[0].description}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#6B5750]/20">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-green-950" />
                <div>
                  <p className="text-sm font-medium">Feels like</p>
                  <p className="text-lg font-semibold">
                    {Math.round(weather.main.feels_like)}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-green-950" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-lg font-semibold">
                    {weather.main.humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 text-green-950" />
                <div>
                  <p className="text-sm font-medium">Cloudiness</p>
                  <p className="text-lg font-semibold">{weather.clouds.all}%</p>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodayWeather;

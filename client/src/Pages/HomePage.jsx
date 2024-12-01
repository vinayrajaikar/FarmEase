import React from 'react'
import TodayWeather from './TodayWeather'
import Forecast from './Forecast'
import CropRecommendations from './CropRecommendations'
import CropInfo from './CropInfo'

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
    <main className="container mx-auto space-y-6 p-4">
      <div className="flex flex-col  sm:flex-row sm:space-x-4">
        <div className="w-full mb-4 sm:w-fit">
          <h3 className="mb-3 text-base text-base text-left font-semibold ">Today's Weather</h3>
          <TodayWeather />
        </div>
        <div className="w-full">
          <h3 className="mb-3 text-base text-left font-semibold ">5 Day's Forecast</h3>
          <Forecast />
        </div>
      </div>
      <CropRecommendations />
      <CropInfo />
    </main>
  </div>
  )
}

export default HomePage

// AuraCastHome.jsx
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import WeatherForm from '../../components/AuraCastComponents/WeatherForm.jsx';
import WeatherResults from '../../components/AuraCastComponents/WeatherResults.jsx';

const AuraCastHome = () => {
    const [analysis, setAnalysis] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mr-4">
                            🌦️
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Will It Rain On My Parade?
                        </h1>
                    </div>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Plan your outdoor events with confidence using NASA's historical weather data
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    <Routes>
                        <Route path="/" element={<WeatherForm onAnalysis={setAnalysis} />} />
                    </Routes>
                    
                    {analysis && (
                        <div className="animate-slide-up">
                            <WeatherResults data={analysis} />
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!analysis && (
                    <div className="mt-16 text-center">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg mb-3 mx-auto">
                                    📅
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Select Your Date</h3>
                                <p className="text-gray-600 text-sm">Choose when your event is happening</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-lg mb-3 mx-auto">
                                    📍
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Enter Location</h3>
                                <p className="text-gray-600 text-sm">Tell us where your event will be held</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-lg mb-3 mx-auto">
                                    🔍
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2">Get Analysis</h3>
                                <p className="text-gray-600 text-sm">Receive detailed weather insights</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuraCastHome;






// import React,{useState} from 'react'
// import {Route, Routes}from 'react-router-dom'
// import WeatherForm from '../../components/AuraCastComponents/WeatherForm.jsx'
// import WeatherResults from '../../components/AuraCastComponents/WeatherResults.jsx'

// const AuraCastHome = () => {
//     const [analysis, setAnalysis] = useState(null);
//   return (
//     <div>
//          <h1>🌦️ Will It Rain On My Parade?</h1>
//         <p>Plan your outdoor events with confidence using NASA historical data</p>
//       <Routes>

//         <Route path="/" element={<WeatherForm onAnalysis={setAnalysis} />} />
//       </Routes>
//       {analysis && <WeatherResults data={analysis} />} 
//     </div>
//   )
// }

// export default AuraCastHome

      




'use client'
import React, { useState } from 'react'

export default function Toggle({onChange}) {
    const [mode, setMode] = useState('dashboard')

    function handleToggle(){
        const newMode = mode === 'dashboard' ? 'website' : 'dashboard'
        setMode(newMode) 

        if(onChange){
            onChange(newMode)

        }
    }
  return (
       <div
      onClick={handleToggle}
      className="w-40 bg-gray-200 rounded-full p-1 cursor-pointer flex items-center"
    >
      <div
        className={`w-1/2 text-center py-2 rounded-full transition-all duration-300 ${
          mode === "dashboard"
            ? "bg-black text-white"
            : "text-gray-600"
        }`}
      >
        Dashboard
      </div>

      <div
        className={`w-1/2 text-center py-2 rounded-full transition-all duration-300 ${
          mode === "website"
            ? "bg-black text-white"
            : "text-gray-600"
        }`}
      >
        Website
      </div>
    </div>
  )
}


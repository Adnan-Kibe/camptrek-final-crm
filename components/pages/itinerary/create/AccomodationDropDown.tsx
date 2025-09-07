'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, Home } from 'lucide-react'

const AccommodationDropDown = () => {
  const {register} = useFormContext()
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Home className="w-5 h-5 text-gray-600" />
        <label className="text-base font-medium text-gray-700">
          Accommodation Type
        </label>
      </div>
      
      <div className="relative">
        <select
          {...register("accommodation")}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium cursor-pointer hover:border-gray-400 shadow-sm"
        >
          <option value="" disabled className="text-gray-400">
            Select accommodation type
          </option>
          <option value="Budget" className="py-2">
            Budget - Affordable stays
          </option>
          <option value="Mid" className="py-2">
            Mid-Range - Comfortable hotels
          </option>
          <option value="Luxury" className="py-2">
            Luxury - Premium experiences
          </option>
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default AccommodationDropDown
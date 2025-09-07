'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronDown, MapPin } from 'lucide-react'

const LocationDropDown = () => {
    const {register} = useFormContext()
    
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <label className="text-base font-medium text-gray-700">
                    Destination
                </label>
            </div>
            
            <div className="relative">
                <select
                    {...register("location")}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium cursor-pointer hover:border-gray-400 shadow-sm"
                >
                    <option value="" disabled className="text-gray-400">
                        Select your destination
                    </option>
                    <option value="Kenya" className="py-2">
                        Kenya
                    </option>
                    <option value="Tanzania" className="py-2">
                        Tanzania
                    </option>
                    <option value="Kenya & Tanzania" className="py-2">
                        Kenya & Tanzania
                    </option>
                    <option value="Uganda" className="py-2">
                        Uganda
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

export default LocationDropDown
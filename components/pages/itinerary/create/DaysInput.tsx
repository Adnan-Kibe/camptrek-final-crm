"use client"
import { Calendar, Trash2, Plus, Building } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

// Reusable components
import NewFormInput from "./NewFormInput"
import TextAreaInput from "./TextAreaInput"
import MultipleImageUploader from "./MultipleImageUploader"

type Day = {
  day: number
  title: string
  details: string
  images: (File | { image_public_id: string; image_url: string })[]
  hotel: {
    name: string
    url: string
    images: (File | { image_public_id: string; image_url: string })[]
  }
}

const DaysInput = () => {
  const { control, register, setValue } = useFormContext<{ days: Day[] }>()
  const { fields, append, remove } = useFieldArray({ control, name: "days" })

  const handleAppend = () => {
    append({
      day: fields.length + 1,
      title: "",
      details: "",
      images: [],
      hotel: { name: "", url: "", images: [] },
    })
  }

  const handleDelete = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 block">
          Itinerary Days
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Plan your day-by-day activities and add photos to your itinerary
        </p>
      </div>

      {/* Empty State */}
      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-1">
            No days added yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click "Add Day" to start building your itinerary
          </p>
        </motion.div>
      )}

      {/* Days List */}
      <div className="space-y-6">
        <AnimatePresence mode="sync">
          {fields.map((field, dayIndex) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {dayIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Day {dayIndex + 1}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(dayIndex)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Day Content */}
              <div className="p-6 space-y-6">
                {/* Hidden Day Number */}
                <input
                  type="hidden"
                  {...register(`days.${dayIndex}.day`)}
                  value={dayIndex + 1}
                />

                {/* Title */}
                <NewFormInput
                  title="Day Title"
                  name={`days.${dayIndex}.title`}
                  placeholder="e.g., Arrival in Nairobi & City Tour"
                />

                {/* Details */}
                <TextAreaInput
                  title="Day Details"
                  name={`days.${dayIndex}.details`}
                  placeholder="Describe the activities, sights, and experiences for this day..."
                />

                {/* Day Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day Images
                  </label>
                  <MultipleImageUploader
                    name={`days.${dayIndex}.images`}
                    title=""
                  />
                </div>

                {/* Hotel Section */}
                <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="w-4 h-4 text-gray-500" />
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                      Hotel Information
                    </h4>
                  </div>

                  <NewFormInput
                    title="Hotel Name"
                    name={`days.${dayIndex}.hotel.name`}
                    placeholder="e.g., Safari Lodge Nairobi"
                  />

                  <NewFormInput
                    title="Hotel URL"
                    name={`days.${dayIndex}.hotel.url`}
                    placeholder="https://hotel-website.com"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hotel Images
                    </label>
                    <MultipleImageUploader
                      name={`days.${dayIndex}.hotel.images`}
                      title=""
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Day Button */}
      <button
        type="button"
        onClick={handleAppend}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Day
      </button>
    </div>
  )
}

export default DaysInput

"use client"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useRef } from "react"
import { useFormContext } from "react-hook-form"

type ImageValue = 
  | File 
  | { image_public_id: string; image_url: string } 
  | null

const MapUploader = () => {
  const { setValue, formState: { errors }, watch } = useFormContext()
  const hasError = errors["map"]
  const watchImage: ImageValue = watch("map")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("map", e.target.files[0], { shouldValidate: true })
    }
  }

  const handleDelete = () => {
    setValue("map", null, { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Helpers
  const isFile = (image: ImageValue): image is File => {
    return image instanceof File
  }

  const isImageObject = (
    image: ImageValue
  ): image is { image_public_id: string; image_url: string } => {
    return (
      image !== null &&
      typeof image === "object" &&
      !isFile(image) &&
      "image_url" in image &&
      "image_public_id" in image
    )
  }

  const getImageUrl = (image: ImageValue): string | null => {
    if (isFile(image)) return URL.createObjectURL(image)
    if (isImageObject(image)) return image.image_url
    return null
  }

  const getImageName = (image: ImageValue): string => {
    if (isFile(image)) return image.name
    if (isImageObject(image)) return `Image (${image.image_public_id})`
    return ""
  }

  const imageUrl = getImageUrl(watchImage)
  const imageName = getImageName(watchImage)

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Map Upload
      </h1>

      {/* Upload area only if no image */}
      {!watchImage && (
        <div
          className={`
            border-2 border-dashed rounded-xl cursor-pointer 
            p-6 flex flex-col items-center justify-center text-center 
            transition-all duration-300
            ${
              hasError
                ? "border-red-500 bg-red-50/30 dark:bg-red-500/10"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Click to upload
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Upload a map image (PNG, JPG)
          </p>
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        id="map"
        type="file"
        accept="image/*"
        onChange={handleClick}
        hidden
      />

      {/* Preview */}
      <AnimatePresence mode="wait">
        {watchImage && imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md mx-auto"
          >
            <img
              src={imageUrl}
              alt={imageName}
              className="w-full h-96 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            />

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              {/* Replace */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
                title="Replace map"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition"
                title="Remove map"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
          >
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {hasError.message as string}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MapUploader

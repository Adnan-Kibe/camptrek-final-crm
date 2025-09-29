"use client"
import { AnimatePresence, motion } from "motion/react"
import React, { useRef } from "react"
import { useFormContext } from "react-hook-form"

type ImageValue =
  | File
  | { image_public_id: string; image_url: string }
  | null

type MultipleImageUploaderProp = {
    name: string
    title: string
}

const MultipleImageUploader = ({ name, title }: MultipleImageUploaderProp) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const watchedImages: ImageValue[] = watch(name) || []
  const hasError = errors[name]
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files).filter(file =>
      file.type.startsWith("image/")
    )

    const existingImages = watchedImages || []
    const newImages = [...existingImages, ...fileArray]
    setValue(name, newImages, { shouldValidate: true })
  }

  const handleRemove = (indexToRemove: number) => {
    const newImages = watchedImages.filter((_, index) => index !== indexToRemove)
    setValue(name, newImages, { shouldValidate: true })
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

  const getImageSize = (image: ImageValue): string | null => {
    if (isFile(image)) return `${(image.size / 1024 / 1024).toFixed(1)} MB`
    return null // cloudinary objects don’t have size
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
          {title}
        </span>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center w-full h-32 
            border-2 border-dashed rounded-lg cursor-pointer 
            transition-all duration-200 ease-in-out
            ${
              hasError
                ? "border-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            }
          `}
        >
          <svg
            className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 
                 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5
                 a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload images</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PNG, JPG, JPEG, WEBP (MAX. 5MB each)
          </p>
        </div>

        <input
          ref={fileInputRef}
          id="images"
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={handleImages}
        />
      </div>

      {/* Error */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-600 dark:text-red-400 font-medium"
          >
            {hasError.message as string}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Previews */}
      {watchedImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Selected Images ({watchedImages.length})
          </h4>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <AnimatePresence mode="sync">
              {watchedImages.map((img, index) => {
                const url = getImageUrl(img)
                const name = getImageName(img)
                const size = getImageSize(img)

                if (!url) return null

                return (
                  <motion.div
                    key={`${name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="h-24 relative overflow-hidden">
                      <img
                        src={url}
                        alt={name}
                        className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105 bg-gray-50 dark:bg-gray-700"
                      />

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(index)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                        type="button"
                      >
                        <svg
                          className="w-2.5 h-2.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      {/* File size (only for Files) */}
                      {size && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {size}
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {name}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultipleImageUploader

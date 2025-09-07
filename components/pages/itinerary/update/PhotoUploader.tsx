'use client'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from "motion/react"
import { Image, Trash2, Plus, Upload } from "lucide-react"

interface PhotoUploaderProps {
  currentImages?: Array<{ id: string; image_url: string }>
  onImagesChange?: (images: { file: File }[]) => void
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ currentImages = [], onImagesChange }) => {
  const { setValue, watch, formState: { errors } } = useFormContext()
  const [isDragging, setIsDragging] = useState(false)
  const uploadedImages = watch('images') || []
  const hasError = !!errors.images

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).map((file) => ({ file }))
    const updatedImages = [...uploadedImages, ...newFiles]
    setValue('images', updatedImages, { shouldValidate: true })
    onImagesChange?.(updatedImages)
  }

  const handleRemoval = (imageIndex: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== imageIndex)
    setValue('images', updatedImages, { shouldValidate: true })
    onImagesChange?.(updatedImages)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files)
    e.target.value = ""
  }

  const hasNewImages = uploadedImages.length > 0

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <span>Itinerary Images</span>
        </label>
        {hasNewImages && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            New images added
          </motion.div>
        )}
      </div>

      {/* Current Images Display */}
      {currentImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((img, index) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt={`Current ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">
                    Current Image
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="space-y-4">
        <input
          type="file"
          id="image-uploader"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handleChange}
        />
        
        <label
          htmlFor="image-uploader"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            cursor-pointer block w-full p-8 border-2 border-dashed rounded-lg text-center transition-all duration-200
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : hasNewImages
                ? 'border-blue-300 bg-blue-50/30'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3">
            {hasNewImages ? (
              <Plus className="w-12 h-12 text-blue-500" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-gray-600 font-medium">
                {hasNewImages ? 'Add More Images' : 'Click to upload new images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, or WebP up to 5MB each
              </p>
              {currentImages.length > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  New images will replace current ones
                </p>
              )}
            </div>
          </div>
        </label>
      </div>

      {/* New Images Preview */}
      <AnimatePresence>
        {hasNewImages && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-700">New Images to Upload</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((img, index) => (
                <motion.div
                  key={`${img.file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <img
                    src={URL.createObjectURL(img.file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoval(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">{img.file.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ scale: 0.7, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            className="text-red-500 font-light text-sm"
          >
            {errors.images?.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PhotoUploader

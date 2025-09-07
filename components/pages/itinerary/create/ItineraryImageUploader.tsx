"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

const ItineraryImageUploader = () => {
  const {
    setValue,
    formState: { errors },
    watch,
    register,
  } = useFormContext();

  // ✅ Ensure `images` field is registered
  useEffect(() => {
    register("images", {
      required: "Please upload at least one image",
    });
  }, [register]);

  // ✅ Schema expects [{ file: File }]
  const watchedImages: { file: File }[] = watch("images") || [];

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({ file }));
    const updatedImages = [...watchedImages, ...newFiles];
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleRemoval = (imageIndex: number) => {
    const updatedImages = watchedImages.filter((_, index) => index !== imageIndex);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-lg font-semibold text-gray-800 mb-4 block">
          Itinerary Images
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Upload images to showcase your itinerary destinations and activities
        </p>
      </div>

      {watchedImages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1 , y: 0}}
          className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className='text-gray-600 text-lg font-medium mb-1'>No images added yet</p>
          <p className='text-gray-500 text-sm'>Click "Upload Images" to add photos to your itinerary</p>
        </motion.div>
      )}

      {/* Image Previews */}
      <AnimatePresence mode='sync'>
        {watchedImages.length > 0 && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            {watchedImages.map((img, index) => (
              <motion.div 
                key={`${img.file.name}-${index}`} 
                className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                layout
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={URL.createObjectURL(img.file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                />
                <motion.button
                  type="button"
                  onClick={() => handleRemoval(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className='w-3 h-3' />
                </motion.button>
                <p className="text-xs text-gray-500 mt-2 truncate px-1 font-medium">{img.file.name}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {errors.images && (
          <motion.p
            initial={{ scale: 0.7, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            className="text-red-500 font-light text-sm"
          >
            {errors.images.message as string}
          </motion.p>
        )}
      </AnimatePresence>

      <div>
        <input
          type="file"
          id="image-uploader"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handleChange}
        />
        <motion.label
          htmlFor="image-uploader"
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          className='w-full bg-primary text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'
        >
          <Upload className='w-5 h-5' />
          Upload Images
        </motion.label>
      </div>
    </div>
  );
};

export default ItineraryImageUploader;
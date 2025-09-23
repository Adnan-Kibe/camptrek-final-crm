"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";

const MapUploader = () => {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const hasError = errors["map"];
  const watchImage = watch("map");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("map", e.target.files[0], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-3">
      <h1>Map Upload</h1>
      <div
        className={`
          border-2 border-dashed rounded-xl cursor-pointer 
          p-6 flex flex-col items-center justify-center text-center 
          transition-all duration-300
          ${hasError ? "border-red-500 bg-red-50/30 dark:bg-red-500/10" : "border-gray-300 dark:border-gray-600 hover:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"}
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
          click to upload
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload a map image (PNG, JPG)</p>
      </div>

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
        {watchImage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md mx-auto"
          >
            <img
              src={URL.createObjectURL(watchImage)}
              alt={watchImage.name}
              className="w-full h-56 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            />
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 truncate">
              Selected: {watchImage.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

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
    </div>
  );
};

export default MapUploader;

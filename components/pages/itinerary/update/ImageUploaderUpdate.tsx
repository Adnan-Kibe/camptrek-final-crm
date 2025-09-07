"use client";

import { Camera, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type ImageItem = {
  file?: File;
  url?: string; // For existing images from backend
  preview?: string;
  isExisting?: boolean; // Flag to identify existing vs new images
};

const ImageDisplay = ({ 
  image, 
  onRemove, 
  index 
}: { 
  image: ImageItem; 
  onRemove: () => void; 
  index: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine image source
  const getImageSrc = () => {
    if (image.url) return image.url; // Existing image from backend
    if (image.preview) return image.preview; // Preview URL
    if (image.file) return URL.createObjectURL(image.file); // New file
    return '';
  };

  const imageSrc = getImageSrc();

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!imageSrc) return null;

  return (
    <div className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Loading State */}
      {isLoading && (
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && !isLoading && (
        <div className="w-full aspect-[4/3] bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <Camera className="w-8 h-8 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      )}

      {/* Image */}
      {!hasError && (
        <img
          src={imageSrc}
          alt={image.file?.name ?? `Image ${index + 1}`}
          className={`w-full aspect-[4/3] object-cover transition-opacity duration-200 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Image Info Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="text-xs font-medium truncate mb-1">
            {image.file?.name ?? (image.isExisting ? "Existing Image" : "Remote Image")}
          </p>
          {image.file && (
            <p className="text-xs text-gray-300">
              {(image.file.size / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageUploaderUpdate = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  // Watch for form images
  const formImages: ImageItem[] = watch("images") || [];

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const currentImages = formImages || [];

    const newImages: ImageItem[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      }));

    const updatedImages = [...currentImages, ...newImages];
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const removeImage = (imageIndex: number) => {
    const updatedImages = formImages.filter((_, index) => index !== imageIndex);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const clearAllImages = () => {
    setValue("images", [], { shouldValidate: true });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e.target.files);
    e.target.value = ""; // Reset input for same file re-selection
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <Camera className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Trip Images</h2>
          <p className="text-sm text-gray-600">Upload images to showcase your itinerary</p>
        </div>
      </div>

      <div className="space-y-6">
        <input
          id="image-uploader"
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleClick}
        />

        <label htmlFor="image-uploader">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-gray-600 transition-all duration-200 cursor-pointer ${
              isDragOver
                ? "border-blue-400 bg-blue-50 text-blue-600"
                : errors.images
                ? "border-red-300 bg-red-50 hover:border-red-400"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isDragOver ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <Upload className={`w-6 h-6 ${isDragOver ? "text-blue-600" : "text-gray-500"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900 mb-1">
                {!isDragOver ? "Click to upload or drag images here" : "Drop the images to upload"}
              </p>
              <p className="text-sm text-gray-500">Support for PNG, JPG, and WebP files</p>
            </div>
          </div>
        </label>

        {errors.images && (
          <p className="text-red-500 text-sm flex items-center gap-2">
            <X className="w-4 h-4" />
            {typeof errors.images.message === "string"
              ? errors.images.message
              : "At least one image is required"}
          </p>
        )}

        {formImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Images ({formImages.length})
              </h3>
              <button
                type="button"
                onClick={clearAllImages}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formImages.map((image, index) => (
                <ImageDisplay
                  key={`image-${index}`}
                  image={image}
                  index={index}
                  onRemove={() => removeImage(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageUploaderUpdate;
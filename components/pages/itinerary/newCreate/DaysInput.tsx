"use client";
import { Calendar, Trash2, Plus, MapPin, Building } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const DaysInput = () => {
  const { control, register, formState: { errors }, setValue, watch } = useFormContext<{
    days: Array<{
      day: number;
      title: string;
      details: string;
      images: File[];
      hotel: {
        name: string;
        url: string;
        images: File[];
      };
    }>;
  }>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });
  
  const handleAppend = () => {
    append({
      day: fields.length + 1,
      title: "",
      details: "",
      images: [],
      hotel: {
        name: "",
        url: "",
        images: [],
      },
    });
  };

  const handleDelete = (index: number) => {
    remove(index);
    // Re-number remaining days
    fields.forEach((_, i) => {
      if (i > index) {
        setValue(`days.${i - 1}.day`, i);
      }
    });
  };

  const handleDayImageChange = (dayIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    const existingImages = watch(`days.${dayIndex}.images`) || [];
    const newImages = [...existingImages, ...fileArray];
    setValue(`days.${dayIndex}.images`, newImages, { shouldValidate: true });
  };

  const handleHotelImageChange = (dayIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    const existingImages = watch(`days.${dayIndex}.hotel.images`) || [];
    const newImages = [...existingImages, ...fileArray];
    setValue(`days.${dayIndex}.hotel.images`, newImages, { shouldValidate: true });
  };

  const removeDayImage = (dayIndex: number, imageIndex: number) => {
    const currentImages = watch(`days.${dayIndex}.images`) || [];
    const newImages = currentImages.filter((_: any, index: number) => index !== imageIndex);
    setValue(`days.${dayIndex}.images`, newImages, { shouldValidate: true });
  };

  const removeHotelImage = (dayIndex: number, imageIndex: number) => {
    const currentImages = watch(`days.${dayIndex}.hotel.images`) || [];
    const newImages = currentImages.filter((_: any, index: number) => index !== imageIndex);
    setValue(`days.${dayIndex}.hotel.images`, newImages, { shouldValidate: true });
  };

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
          className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-1">No days added yet</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Click "Add Day" to start building your itinerary</p>
        </motion.div>
      )}

      {/* Days List */}
      <div className="space-y-6">
        <AnimatePresence mode="sync">
          {fields.map((field, dayIndex) => {
            const dayImages = watch(`days.${dayIndex}.images`) || [];
            const hotelImages = watch(`days.${dayIndex}.hotel.images`) || [];
            const dayErrors = errors?.days?.[dayIndex];

            return (
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
                  {/* Day Number (Hidden Input) */}
                  <input
                    type="hidden"
                    {...register(`days.${dayIndex}.day`)}
                    value={dayIndex + 1}
                  />

                  {/* Day Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Day Title
                    </label>
                    <input
                      {...register(`days.${dayIndex}.title`)}
                      placeholder="e.g., Arrival in Nairobi & City Tour"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                    {dayErrors?.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {dayErrors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Day Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Day Details
                    </label>
                    <textarea
                      {...register(`days.${dayIndex}.details`)}
                      rows={4}
                      placeholder="Describe the activities, sights, and experiences for this day..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                    {dayErrors?.details && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {dayErrors.details.message}
                      </p>
                    )}
                  </div>

                  {/* Day Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Day Images
                    </label>
                    <div className="space-y-3">
                      <label
                        htmlFor={`day-images-${dayIndex}`}
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <Plus className="w-6 h-6 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Click to upload day images
                          </p>
                        </div>
                      </label>
                      <input
                        id={`day-images-${dayIndex}`}
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={(e) => handleDayImageChange(dayIndex, e)}
                      />

                      {/* Day Images Preview */}
                      {dayImages.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {dayImages.map((img: File, imgIndex: number) => (
                            <motion.div
                              key={`day-${dayIndex}-img-${imgIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative group bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                              <div className="h-16 relative">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt={img.name}
                                  className="w-full h-full object-contain bg-gray-50 dark:bg-gray-700"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeDayImage(dayIndex, imgIndex)}
                                  className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      {dayErrors?.images && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {dayErrors.images.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hotel Section */}
                  <div className="bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="w-4 h-4 text-gray-500" />
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                        Hotel Information
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {/* Hotel Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hotel Name
                        </label>
                        <input
                          {...register(`days.${dayIndex}.hotel.name`)}
                          placeholder="e.g., Safari Lodge Nairobi"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                        {dayErrors?.hotel?.name && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {dayErrors.hotel.name.message}
                          </p>
                        )}
                      </div>

                      {/* Hotel URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Hotel URL
                        </label>
                        <input
                          {...register(`days.${dayIndex}.hotel.url`)}
                          type="url"
                          placeholder="https://hotel-website.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                        {dayErrors?.hotel?.url && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {dayErrors.hotel.url.message}
                          </p>
                        )}
                      </div>

                      {/* Hotel Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Hotel Images
                        </label>
                        <div className="space-y-3">
                          <label
                            htmlFor={`hotel-images-${dayIndex}`}
                            className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-2 pb-2">
                              <Building className="w-5 h-5 text-gray-400 mb-1" />
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Upload hotel images
                              </p>
                            </div>
                          </label>
                          <input
                            id={`hotel-images-${dayIndex}`}
                            type="file"
                            multiple
                            accept="image/*"
                            hidden
                            onChange={(e) => handleHotelImageChange(dayIndex, e)}
                          />

                          {/* Hotel Images Preview */}
                          {hotelImages.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                              {hotelImages.map((img: File, imgIndex: number) => (
                                <motion.div
                                  key={`hotel-${dayIndex}-img-${imgIndex}`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="relative group bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                  <div className="h-16 relative">
                                    <img
                                      src={URL.createObjectURL(img)}
                                      alt={img.name}
                                      className="w-full h-full object-contain bg-gray-50 dark:bg-gray-700"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeHotelImage(dayIndex, imgIndex)}
                                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          {dayErrors?.hotel?.images && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {dayErrors.hotel.images.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
  );
};

export default DaysInput;
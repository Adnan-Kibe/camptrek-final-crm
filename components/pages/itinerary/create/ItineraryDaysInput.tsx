"use client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Trash2, Calendar, Upload } from 'lucide-react';

type DayForm = {
  days: {
    day: number;
    title: string;
    details: string;
    images: { file: File }[];
  }[];
}

const ItineraryDaysInput = () => {
  const { register, control, formState: { errors }, setValue, watch } = useFormContext<DayForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days"
  });

  const handleAppend = () => {
    append({
      day: fields.length + 1,
      title: "",
      details: "",
      images: []
    });
  };

  // Image handling for a specific day
  const handleImageUpload = (files: FileList | null, dayIndex: number) => {
    if (!files) return;
    
    const currentDayImages = watch(`days.${dayIndex}.images`) || [];
    const newFiles = Array.from(files).map(file => ({ file })); // Wrap each file in an object
    const updatedImages = [...currentDayImages, ...newFiles];
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  const handleRemoval = (imageIndex: number, dayIndex: number) => {
    const currentDayImages = watch(`days.${dayIndex}.images`) || [];
    const updatedImages = currentDayImages.filter((_, index) => index !== imageIndex);
    setValue(`days.${dayIndex}.images`, updatedImages);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, dayIndex: number) => {
    handleImageUpload(e.target.files, dayIndex);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-lg font-semibold text-gray-800 mb-4 block">
          Itinerary Days
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Plan your day-by-day activities and add photos to your itinerary
        </p>
      </div>

      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20}}
          animate={{ opacity: 1 , y: 0}}
          className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className='text-gray-600 text-lg font-medium mb-1'>No days added yet</p>
          <p className='text-gray-500 text-sm'>Click "Add Day" to start building your itinerary</p>
        </motion.div>
      )}

      <AnimatePresence mode='sync'>
        {fields.map((field, dayIndex) => {
          const dayImages = watch(`days.${dayIndex}.images`) || [];
          
          return (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200'
            >
              <div className='space-y-4'>
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 block">
                    Day #{dayIndex + 1}
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='button'
                    onClick={() => remove(dayIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 text-sm"
                  >
                    <Trash2 className='w-3 h-3' /> 
                    Remove
                  </motion.button>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Title
                  </label>
                  <div className="relative">
                    <input
                      {...register(`days.${dayIndex}.title`)}
                      type="text"
                      placeholder='Enter day title (e.g., Exploring Downtown)'
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white" 
                    />
                  </div>
                  <AnimatePresence>
                    {errors.days?.[dayIndex]?.title && (
                      <motion.p
                        initial={{ scale: 0.7, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: -10 }}
                        className="text-red-500 font-light text-sm mt-1"
                      >
                        {errors.days[dayIndex].title.message as string}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Details Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Details
                  </label>
                  <div className="relative">
                    <textarea
                      {...register(`days.${dayIndex}.details`)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white resize-none"
                      rows={3}
                      placeholder="Day details and activities"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.days?.[dayIndex]?.details && (
                      <motion.p
                        initial={{ scale: 0.7, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: -10 }}
                        className="text-red-500 font-light text-sm mt-1"
                      >
                        {errors.days[dayIndex].details.message as string}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Images for Day {dayIndex + 1}
                  </label>
                  
                  <input
                    type="file"
                    id={`day-images-${dayIndex}`}
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => handleImageChange(e, dayIndex)}
                  />
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    htmlFor={`day-images-${dayIndex}`}
                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                  >
                    <Upload className='w-4 h-4' />
                    Upload Images
                  </motion.label>

                  {/* Image Previews */}
                  <AnimatePresence mode="popLayout">
                    {dayImages.length > 0 && (
                      <motion.div 
                        className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        layout
                      >
                        {dayImages.map((imageObj: { file: File }, imageIndex: number) => (
                          <motion.div 
                            key={`${imageObj.file.name}-${imageIndex}`} 
                            className="relative bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                              src={URL.createObjectURL(imageObj.file)}
                              alt={`Day ${dayIndex + 1} - Image ${imageIndex + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <motion.button
                              type="button"
                              onClick={() => handleRemoval(imageIndex, dayIndex)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              ×
                            </motion.button>
                            <p className="text-xs text-gray-500 mt-1 truncate px-1">
                              {imageObj.file.name}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {errors.days?.[dayIndex]?.images && (
                      <motion.p
                        initial={{ scale: 0.7, opacity: 0, y: -10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: -10 }}
                        className="text-red-500 font-light text-sm mt-1"
                      >
                        {errors.days[dayIndex].images.message as string}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.button
        type='button'
        whileHover={{scale: 1.02}}
        whileTap={{scale: 0.98}}
        className='w-full bg-primary text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2'
        onClick={handleAppend}
      >
        <Plus className='w-5 h-5' />
        Add Day
      </motion.button>
    </div>
  );
};

export default ItineraryDaysInput;
"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

type ItineraryTextAreaProp = {
    title: string
    name: string
    placeholder?: string
    required?: boolean
    description?: string
    maxLength?: number
    rows?: number
}

const ItineraryTextArea = ({
  title, 
  name, 
  placeholder,
  required = false,
  description,
  maxLength = 2000,
  rows = 4
}: ItineraryTextAreaProp) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);
  const fieldValue = watch(name) || "";
  const hasError = !!errors[name];
  const hasValue = fieldValue && fieldValue.length > 0;
  const charCount = fieldValue.length;
  const isNearLimit = charCount > maxLength * 0.8;

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label and Description */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <span className="capitalize">{title}</span>
            {required && (
              <motion.span 
                className="text-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                *
              </motion.span>
            )}
          </label>
          
          {/* Character Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused || hasValue ? 1 : 0 }}
            className={`text-xs font-medium ${
              isNearLimit ? 'text-orange-500' : 
              charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {charCount}/{maxLength}
          </motion.div>
        </div>
        
        {description && (
          <motion.p 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* TextArea Container */}
      <div className="relative">
        <motion.div
          className={`
            relative rounded-lg border-2 transition-all duration-200 overflow-hidden
            ${hasError 
              ? 'border-red-300 bg-red-50/30' 
              : hasValue 
                ? 'border-green-300 bg-green-50/30'
                : isFocused
                  ? 'border-blue-500 bg-blue-50/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white/50'
            }
          `}
          whileHover={{ scale: isFocused ? 1 : 1.005 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.textarea
            {...register(name, { maxLength })}
            rows={rows}
            placeholder={placeholder}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full px-4 py-3 bg-transparent resize-none
              placeholder:text-gray-400 text-gray-700
              focus:outline-none
              transition-all duration-200
              ${isFocused ? 'placeholder:opacity-60' : ''} resize-y
            `}
            whileFocus={{ scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
          
        </motion.div>
        
        {/* Status Indicator */}
        <AnimatePresence>
          {hasValue && !hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-3"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
            </motion.div>
          )}
          {hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 180 }}
              className="absolute right-3 top-3"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar for Character Count */}
      <AnimatePresence>
        {(isFocused || hasValue) && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="h-1 bg-gray-200 rounded-full overflow-hidden"
            style={{ transformOrigin: 'left' }}
          >
            <motion.div
              className={`h-full rounded-full transition-colors duration-300 ${
                charCount >= maxLength ? 'bg-red-500' :
                isNearLimit ? 'bg-orange-500' : 'bg-blue-500'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min((charCount / maxLength) * 100, 100)}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md"
          >
            <motion.div
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-shrink-0 mt-0.5"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <p className="text-sm text-red-600 font-medium leading-relaxed">
              {errors[name]?.message as string}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {hasValue && !hasError && charCount >= 10 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
            className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              className="flex-shrink-0"
            >
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <p className="text-sm text-green-600 font-medium">
              Great detail! This will help create a perfect itinerary.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ItineraryTextArea;
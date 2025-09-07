"use client";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFormContext } from "react-hook-form";

type CustomFormInputProp = {
  title: string;
  name: string;
  type?: "text" | "number";
  placeholder?: string;
  required?: boolean;
  description?: string;
};

const CustomFormInput = ({
  title,
  name,
  type = "text",
  placeholder,
  required = false,
  description,
}: CustomFormInputProp) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const fieldValue = watch(name);
  const hasError = !!errors[name];
  const hasValue = fieldValue !== undefined && fieldValue !== "";

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label and Description */}
      <div className="space-y-1">
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
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>

      {/* Input Container */}
      <div className="relative">
        <motion.input
          {...register(name, {
            valueAsNumber: type === "number", // ✅ ensures numbers come as numbers
          })}
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            bg-white/50 backdrop-blur-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-0
            ${hasError 
              ? "border-red-300 focus:border-red-500 bg-red-50/30" 
              : hasValue 
                ? "border-green-300 focus:border-green-500 bg-green-50/30"
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
            }
            ${hasValue ? "shadow-sm" : ""}
          `}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />

        {/* Input Status Indicator */}
        <AnimatePresence>
          {hasValue && !hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </motion.div>
          )}
          {hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <p className="text-sm text-red-600 font-medium">
              {errors[name]?.message as string}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default CustomFormInput;

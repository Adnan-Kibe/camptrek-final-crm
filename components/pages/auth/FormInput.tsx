"use client";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProp = {
  label: string;
  type?: "text" | "password" | "email";
  name: string;
  disabled?: boolean
};

const FormInput = ({ label, type = "text", name, disabled }: FormInputProp) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={type}
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
          placeholder={`Enter your ${label.toLowerCase()}`}
          disabled={disabled}
        />
      </div>

      <AnimatePresence mode="wait">
        {errors[name] && (
          <motion.p
            key={`error-${name}`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-sm text-red-600 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            {errors[name]?.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormInput;
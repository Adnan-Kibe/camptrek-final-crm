"use client";

import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFormContext } from "react-hook-form";

type NewFormInputProp = {
  title: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number";
};

const NewFormInput = ({
  title,
  name,
  placeholder,
  type = "text",
}: NewFormInputProp) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = errors[name];
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <div className="relative w-full mb-2">
      {/* Floating Label */}
      <label
        htmlFor={name}
        className={`
          absolute left-3 top-3 text-sm font-medium text-gray-500 dark:text-gray-400 
          transition-all duration-200 pointer-events-none capitalize
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-400
          ${hasError ? "peer-focus:text-red-600 dark:peer-focus:text-red-400" : ""}
        `}
      >
        {title}
      </label>

      {/* Input */}
      <input
        {...register(name, { valueAsNumber: type === "number" })}
        id={name}
        type={type}
        placeholder={placeholder || " "}
        className={`
          peer w-full px-3 pt-6 pb-2 rounded-lg border-2 transition-all duration-200 outline-none
          bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
          placeholder-transparent
          ${hasError
            ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-400/30 shadow-sm shadow-red-100 dark:shadow-red-900/30"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 shadow-sm shadow-gray-100 dark:shadow-gray-900/30"}
        `}
      />

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400 font-medium"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewFormInput;

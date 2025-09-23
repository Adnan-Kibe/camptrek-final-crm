"use client"

import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"

type TextAreaInputProps = {
  title: string
  name: string
  placeholder?: string
  rows?: number
  required?: boolean
}

const TextAreaInput = ({
  title,
  name,
  placeholder,
  rows = 4,
  required = false,
}: TextAreaInputProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()

  const [isFocused, setIsFocused] = useState(false)
  const fieldValue = watch(name) || ""
  const hasError = !!errors[name]
  const hasValue = fieldValue && fieldValue.length > 0
  const errorMessage = errors[name]?.message as string | undefined

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        <span className="capitalize">{title}</span>
        {required && <span className="text-red-500">*</span>}
      </label>

      {/* Textarea Container */}
      <motion.div
        className={`
          relative rounded-lg border-2 transition-all duration-200
          ${hasError
            ? "border-red-300 bg-red-50/30"
            : hasValue
            ? "border-green-300 bg-green-50/30"
            : isFocused
            ? "border-blue-500 bg-blue-50/20"
            : "border-gray-200 hover:border-gray-300 bg-white/50"}
        `}
        whileHover={{ scale: isFocused ? 1 : 1.005 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.textarea
          {...register(name)}
          rows={rows}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 bg-transparent
            placeholder:text-gray-400 text-gray-700
            focus:outline-none transition-all duration-200 resize-y
          `}
          whileFocus={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>

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
            <svg
              className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-600 font-medium leading-relaxed">
              {errorMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TextAreaInput

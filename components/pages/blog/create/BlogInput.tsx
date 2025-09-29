'use client'

import { AnimatePresence, motion } from "motion/react"
import React from "react"
import { useFormContext } from "react-hook-form"

type BlogInputProp = {
  title: string
  name: string
  placeholder?: string
  type?: "text" | "number"
}

const BlogInput = ({ title, name, placeholder, type = "text" }: BlogInputProp) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const hasError = !!errors[name]
  const errorMessage = errors[name]?.message as string | undefined

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <div className="space-y-1">
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <span className="capitalize">{title}</span>
        </label>
      </div>

      {/* Input */}
      <motion.input
        {...register(name, { valueAsNumber: type === "number" })}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          bg-white/50 backdrop-blur-sm
          placeholder:text-gray-400
          focus:outline-none focus:ring-0
          ${
            hasError
              ? "border-red-300 focus:border-red-500 bg-red-50/30"
              : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
          }
        `}
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

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
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
            <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BlogInput

'use client'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from "motion/react"
import { FileText } from "lucide-react"

interface TitleInputProps {
  currentValue?: string
  onFieldChange?: (field: string, value: any) => void
}

const TitleInput: React.FC<TitleInputProps> = ({ currentValue, onFieldChange }) => {
  const { register, formState: { errors }, watch } = useFormContext()
  const titleValue = watch('title')
  const hasError = !!errors.title
  const hasValue = titleValue && titleValue.length > 0
  const isChanged = titleValue !== currentValue

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <span>Trip Title</span>
          <span className="text-red-500">*</span>
        </label>
        {isChanged && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
          >
            Modified
          </motion.div>
        )}
      </div>
      
      <div className="relative">
        <input
          {...register('title')}
          placeholder="e.g., Amazing Safari"
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            bg-white/50 backdrop-blur-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-0
            ${hasError 
              ? "border-red-300 focus:border-red-500 bg-red-50/30" 
              : hasValue 
                ? isChanged
                  ? "border-blue-300 focus:border-blue-500 bg-blue-50/30"
                  : "border-green-300 focus:border-green-500 bg-green-50/30"
                : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
            }
          `}
          onChange={(e) => onFieldChange?.('title', e.target.value)}
        />
        
        {isChanged && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </motion.div>
        )}
      </div>
      
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {errors.title?.message as string}
        </motion.p>
      )}
    </motion.div>
  )
}

export default TitleInput

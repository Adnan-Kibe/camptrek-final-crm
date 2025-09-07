'use client'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { motion } from "motion/react"
import { Type, Edit3 } from "lucide-react"

interface ContentEditorProps {
  currentValue?: string
  onFieldChange?: (field: string, value: any) => void
}

const ContentEditor: React.FC<ContentEditorProps> = ({ currentValue, onFieldChange }) => {
  const { register, formState: { errors }, watch } = useFormContext()
  const [isFocused, setIsFocused] = useState(false)
  const contentValue = watch('overview') || ""
  const hasError = !!errors.overview
  const hasValue = contentValue && contentValue.length > 0
  const isChanged = contentValue !== currentValue
  const charCount = contentValue.length
  const maxLength = 1000
  const isNearLimit = charCount > maxLength * 0.8

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <span>Trip Overview</span>
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

      <div className="relative">
        <motion.div
          className={`
            relative rounded-lg border-2 transition-all duration-200 overflow-hidden
            ${hasError 
              ? 'border-red-300 bg-red-50/30' 
              : hasValue 
                ? isChanged
                  ? 'border-blue-300 bg-blue-50/30'
                  : 'border-green-300 bg-green-50/30'
                : isFocused
                  ? 'border-blue-500 bg-blue-50/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white/50'
            }
          `}
          whileHover={{ scale: isFocused ? 1 : 1.005 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.textarea
            {...register('overview', { maxLength })}
            placeholder="Write a detailed overview of the trip..."
            rows={6}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onFieldChange?.('overview', e.target.value)}
            className="w-full px-4 py-3 bg-transparent resize-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
          />
          
          {isChanged && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-3 top-3"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {hasError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {errors.overview?.message as string}
        </motion.p>
      )}

      {/* Content Preview */}
      {isChanged && hasValue && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Edit3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Preview</span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3">
            {contentValue}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ContentEditor

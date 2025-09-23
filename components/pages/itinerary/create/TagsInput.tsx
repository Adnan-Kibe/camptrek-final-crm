'use client'
import { Plus, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'

const TagsInput = () => {
  const { control, formState: { errors } } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  const [inputValue, setInputValue] = useState('')

  const handleAddTag = () => {
    if (inputValue.trim()) {
      append({ item: inputValue.trim() }) 
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">Tags</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter a tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tags Display */}
      <div className="space-y-2">
        <AnimatePresence>
          {fields.map((field: any, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <span className="text-sm text-gray-800 font-medium">
                {field.item}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Remove tag"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No tags added yet. Add your first tag above.
          </p>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence mode="wait">
        {errors.tags && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400 font-medium"
          >
            {errors.tags.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TagsInput
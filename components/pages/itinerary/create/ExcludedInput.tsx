'use client'
import { Plus, Trash2, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const ExcludedInput = () => {
  const { control, formState: { errors } } = useFormContext()
  const { fields, remove, append } = useFieldArray({
    control,
    name: "costExclusive"
  })

  const [inputValue, setInputValue] = useState('')

  const handleAddItem = () => {
    if (inputValue.trim()) {
      append({ item: inputValue.trim() })
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddItem()
    }
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          Cost Exclusive
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="e.g., Personal expenses, tips, insurance"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Display Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {fields.map((field: any, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <span className="text-sm text-black font-medium flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                {field.item}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <p className="text-sm text-gray-500 italic">
            No exclusions added yet. Add your first exclusion above.
          </p>
        )}
      </div>

      {/* Animated Error */}
      <AnimatePresence mode="wait">
        {errors.costExclusive && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400 font-medium"
          >
            {errors.costExclusive.message as string}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExcludedInput
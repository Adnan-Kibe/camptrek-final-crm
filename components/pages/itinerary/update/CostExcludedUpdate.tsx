"use client";
import { Plus, Trash2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const CostExcludedUpdate = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control,
    name: "cost_exclusive", // 👈 match schema
  });

  const handleAppend = () => {
    append(""); // since it's string[], just append empty string
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          Cost Excludes
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Add items that are <strong>not included</strong> in the tour price
        </p>
      </div>

      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-dashed border-red-300 hover:border-red-400 transition-colors duration-200"
        >
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-700 text-lg font-medium mb-1">
            No exclusions added yet
          </p>
          <p className="text-red-600 text-sm">
            Click "Add Exclusion" to start listing what’s not included
          </p>
        </motion.div>
      )}

      <AnimatePresence mode="sync">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            layout
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                Exclusion #{index + 1}
              </label>
              <div className="relative">
                <input
                  {...register(`cost_exclusive.${index}`)} // 👈 directly string[]
                  placeholder="e.g., International flights"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2.5 flex items-center gap-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {errors.cost_exclusive && (
          <motion.p
            initial={{ scale: 0.7, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            className="text-red-500 font-light text-sm"
          >
            {errors.cost_exclusive?.message as string}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={handleAppend}
      >
        <Plus className="w-5 h-5" />
        Add Exclusion
      </motion.button>
    </div>
  );
};

export default CostExcludedUpdate;

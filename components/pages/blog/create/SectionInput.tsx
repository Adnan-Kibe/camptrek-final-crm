"use client";
import { Plus, Trash2, FileText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import BlogInput from "./BlogInput";
import TextAreaBlog from "./TextAreaBlog";
import ImageUploader from "./ImageUploader";

const SectionInput = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "sections",
  });

  const handleAppend = () => {
    append({
      title: "",
      content: "",
      image: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 block">
          Blog Sections
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add multiple sections with a title, content, and an optional image
        </p>
      </div>

      {/* Empty State */}
      {fields.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-1">
            No sections added yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Click "Add Section" to start writing your blog
          </p>
        </motion.div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        <AnimatePresence mode="sync">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-750 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Section {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <BlogInput
                  title="Section Title"
                  name={`sections.${index}.title`}
                />

                <TextAreaBlog
                  title="Section Content"
                  name={`sections.${index}.content`}
                  placeholder="Write details for this section..."
                />

                <ImageUploader
                  title="Section Image"
                  name={`sections.${index}.image`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Section Button */}
      <button
        type="button"
        onClick={handleAppend}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
      >
        <Plus className="w-4 h-4" />
        Add Section
      </button>
    </div>
  );
};

export default SectionInput;

'use client'
import React, { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from "motion/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { baseInstance } from "@/constants/api"
import { blogSchema, TsBlog } from "@/store/blogZodStore"
import { 
  FileText, 
  Image, 
  Type, 
  Trash2,
  Save
} from "lucide-react"

const CreatePage = () => {
  const methods = useForm<TsBlog>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined as any
    }
  })

  const queryClient = useQueryClient()
  const router = useRouter()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      methods.setValue('image', { file })
    }
  }

  const removeImage = () => {
    methods.setValue('image', undefined as any)
  }

  const handleImagesUpload = async (image: { file: File }) => {
    const formData = new FormData();
    formData.append("file", image.file)

    const response = await baseInstance.post(
      "/blogs/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  const createBlog = async (data: TsBlog) => {
    const processedImage = await handleImagesUpload(data.image)
    const payLoad = {
      title: data.title,
      content: data.content,
      image_url: processedImage.image_url,
      image_public_id: processedImage.image_public_id
    }

    const response = await baseInstance.post("/blogs/create", payLoad)
    if (response.status !== 201) throw new Error("Failed to create blog.");
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      router.push('/blogs')
    }
  });

  const { handleSubmit, register, watch, formState: { errors } } = methods
  const image = watch('image')

  const onSubmit = async (data: TsBlog) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
            <p className="text-lg text-gray-600">Share your stories and insights</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Basic Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-600">Essential details about your blog post</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Blog Title</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('title')}
                    placeholder="Enter your blog title..."
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Blog Image Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Image className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Blog Image</h2>
                  <p className="text-sm text-gray-600">Add a featured image for your blog post</p>
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  id="blog-image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {!image ? (
                  <label
                    htmlFor="blog-image"
                    className="cursor-pointer block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload blog image</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP up to 5MB</p>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(image.file)}
                      alt="Blog preview"
                      className="w-full h-64 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="text-sm text-gray-500 mt-2">{image.file.name}</p>
                  </div>
                )}
                
                {errors.image && (
                  <p className="text-red-500 text-sm">{errors.image.message}</p>
                )}
              </div>
            </section>

            {/* Blog Content Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Type className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Blog Content</h2>
                  <p className="text-sm text-gray-600">Write your blog content</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span>Main Content</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('content')}
                    placeholder="Write your blog content here..."
                    rows={10}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-y min-h-[200px]"
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Publish?</h3>
                  <p className="text-sm text-gray-600">Review your content and publish the blog post</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isPending}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                      isPending
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Publish Blog
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </section>

          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default CreatePage
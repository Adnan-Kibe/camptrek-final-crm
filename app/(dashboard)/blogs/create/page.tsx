'use client'

import BlogInput from '@/components/pages/blog/create/BlogInput'
import ImageUploader from '@/components/pages/blog/create/ImageUploader'
import SectionInput from '@/components/pages/blog/create/SectionInput'
import TextAreaBlog from '@/components/pages/blog/create/TextAreaBlog'
import { blogSchema, TsBlog } from '@/store/blogZodStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from 'motion/react'
import { FileText, User, Image as ImageIcon, Save } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'

const CreatePage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  const methods = useForm<TsBlog>({
    resolver: zodResolver(blogSchema),
    mode: 'onSubmit',
  })

  const { handleSubmit, formState: { isValid } } = methods

  const handleImage = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await baseInstance.post(
        "/blogs/update-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return response.data
    } catch (error) {
      alert("Error uploading image. Please try again.")
      throw error
    }
  }

  const processImage = async (
    image: File | { image_public_id: string; image_url: string }
  ) => {
    if (!(image instanceof File)) return image
    const uploaded = await handleImage(image)
    return uploaded
  }

  const CreateBlog = async (data: TsBlog) => {
    const processCoverImage = await processImage(data.image)
    data.sections = await Promise.all(
      data.sections.map(async (section) => ({
        ...section,
        image: await processImage(section.image),
      }))
    )
    const payload = {
      title: data.title,
      content: data.content,
      author: data.author,
      image: {
        image_public_id: processCoverImage.image_public_id,
        image_url: processCoverImage.image_url
      },
      sections: data.sections
    }
    const response = await baseInstance.post("/blogs/", payload)
    return response.data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: CreateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      router.replace("/blogs")
    }
  })

  const onSubmit = (data: TsBlog) => {
    mutate(data)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Blog
          </h1>
          <p className="text-lg text-gray-600">
            Share your story with the world
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Provide the main details of your blog
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <BlogInput title="Title" name="title" />
                <BlogInput title="Author" name="author" />
              </div>
            </section>

            {/* Media */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cover Image
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add a main image for your blog
                  </p>
                </div>
              </div>

              <ImageUploader title="Cover Image" name="image" />
            </section>

            {/* Content */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Content
                  </h2>
                  <p className="text-sm text-gray-600">
                    Write the main body and add sections
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <TextAreaBlog title="Main Content" name="content" />
                <SectionInput />
              </div>
            </section>

            {/* Submit */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Publish?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click the button below to create your blog
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isPending || !isValid}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    !isPending
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit Blog
                    </>
                  )}
                </motion.button>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default CreatePage

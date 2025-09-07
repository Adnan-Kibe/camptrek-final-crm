'use client'
import React, { useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from "motion/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useParams } from "next/navigation"
import { baseInstance } from "@/constants/api"
import { blogSchema, TsBlog } from "@/store/blogZodStore"
import { 
  FileText, 
  User, 
  Image, 
  Type, 
  Plus,
  Trash2,
  Save,
  Eye,
  ArrowLeft,
  Loader2
} from "lucide-react"
import Link from 'next/link'

// Blog interface for API response
interface Blog {
  id: string
  title: string
  content: string
  image_url: string
  image_public_id: string
  author_name: string
  author_email: string
  created_at: string
}

const UpdatePage = () => {
  const params = useParams()
  const blogId = params.id as string
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
  const [isFocused, setIsFocused] = useState(false)
  const [subheadings, setSubheadings] = useState<Array<{ title: string; content: string }>>([])
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('')

  // Fetch blog data
  const { data: blog, isLoading: isLoadingBlog, error: blogError } = useQuery<Blog>({
    queryKey: ['blog', blogId],
    queryFn: async () => {
      const response = await baseInstance.get(`/blogs/${blogId}`)
      return response.data
    },
    enabled: !!blogId
  })

  // Update form when blog data is loaded
  useEffect(() => {
    if (blog) {
      methods.reset({
        title: blog.title,
        content: blog.content,
        image: undefined as any
      })
      setCurrentImageUrl(blog.image_url)
    }
  }, [blog, methods])

  const addSubheading = () => {
    const newSubheading = { title: '', content: '' }
    setSubheadings([...subheadings, newSubheading])
  }

  const removeSubheading = (index: number) => {
    const updatedSubheadings = subheadings.filter((_, i) => i !== index)
    setSubheadings(updatedSubheadings)
  }

  const updateSubheading = (index: number, field: 'title' | 'content', value: string) => {
    const updatedSubheadings = [...subheadings]
    updatedSubheadings[index] = { ...updatedSubheadings[index], [field]: value }
    setSubheadings(updatedSubheadings)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      methods.setValue('image', { file })
      setCurrentImageUrl('') // Clear current image when new one is selected
    }
  }

  const removeImage = () => {
    methods.setValue('image', undefined as any)
    setCurrentImageUrl('')
  }

  const handleImagesUpload = async (image: { file: File }) => {
    try {
      const formData = new FormData();
      formData.append("file", image.file)

      console.log('Uploading image:', image.file.name, 'Size:', image.file.size)

      const response = await baseInstance.post(
        "/blogs/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log('Upload response:', response.data)
      return response.data;
    } catch (error: any) {
      console.error('Image upload failed:', error)
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw new Error(`Image upload failed: ${error.response?.data?.detail || error.message}`)
    }
  };

  const updateBlog = async (data: TsBlog) => {
    try {
      console.log('Starting blog update with data:', data)
      
      let imageData = null
      
      // If new image is uploaded, upload it first
      if (data.image) {
        imageData = await handleImagesUpload(data.image)
        console.log('Image processed successfully:', imageData)
      }

      const payload: any = {
        title: data.title,
        content: data.content
      }

      // Only include image fields if new image was uploaded
      if (imageData) {
        payload.image_url = imageData.image_url
        payload.image_public_id = imageData.image_public_id
      }
      
      console.log('Sending blog update payload:', payload)

      const response = await baseInstance.patch(`/blogs/update/${blogId}`, payload)
      console.log('Blog update response:', response)
      
      if (response.status !== 200) throw new Error("Failed to update blog.");
      
      return response.data
    } catch (error: any) {
      console.error('Blog update failed:', error)
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      queryClient.invalidateQueries({ queryKey: ['blog', blogId] })
      router.push('/blogs')
    }
  });

  const { handleSubmit, register, watch, formState: { errors } } = methods
  const content = watch('content') || ""
  const image = watch('image')

  const onSubmit = async (data: TsBlog) => {
    mutate(data)
  }

  if (isLoadingBlog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (blogError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist or has been deleted.</p>
          <Link 
            href="/blogs"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/blogs"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Blogs
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Update Blog Post</h1>
            <p className="text-lg text-gray-600">Edit your blog content and settings</p>
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
                  <p className="text-sm text-gray-600">Update the essential details about your blog post</p>
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
                  <p className="text-sm text-gray-600">Update the featured image for your blog post</p>
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
                
                {!image && !currentImageUrl ? (
                  <label
                    htmlFor="blog-image"
                    className="cursor-pointer block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload new blog image</p>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG, or WebP up to 5MB</p>
                  </label>
                ) : (
                  <div className="relative">
                    <img
                      src={image ? URL.createObjectURL(image.file) : currentImageUrl}
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
                    <p className="text-sm text-gray-500 mt-2">
                      {image ? image.file.name : 'Current image'}
                    </p>
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
                  <p className="text-sm text-gray-600">Update your blog content with optional subheadings</p>
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
                    placeholder="Write your main blog content here..."
                    rows={8}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content.message}</p>
                  )}
                </div>

                {/* Subheadings Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Subheadings & Sections</h4>
                    <button
                      type="button"
                      onClick={addSubheading}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  </div>

                  {subheadings.map((subheading, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-700">Section {index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeSubheading(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Subheading title..."
                          value={subheading.title}
                          onChange={(e) => updateSubheading(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          placeholder="Subheading content..."
                          rows={3}
                          value={subheading.content}
                          onChange={(e) => updateSubheading(index, 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Save Changes?</h3>
                  <p className="text-sm text-gray-600">Review your changes and update the blog post</p>
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Blog
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

export default UpdatePage
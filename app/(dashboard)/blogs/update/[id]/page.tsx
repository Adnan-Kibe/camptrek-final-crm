'use client'
import BlogInput from '@/components/pages/blog/create/BlogInput'
import ImageUploader from '@/components/pages/blog/create/ImageUploader'
import SectionInput from '@/components/pages/blog/create/SectionInput'
import TextAreaBlog from '@/components/pages/blog/create/TextAreaBlog'
import { baseInstance } from '@/constants/api'
import { blogSchema, TsBlog } from '@/store/blogZodStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const UpdatePage = () => {
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()
  const router = useRouter()

  // Memoize the fetch function to prevent unnecessary re-creates
  const handleFetch = useMemo(() => async () => {
    const response = await baseInstance.get(`/blogs/${id}/full`)
    return response.data
  }, [id])

  const {data: blog, isLoading, error} = useQuery({ 
    queryKey: ['blog', id], 
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    retry: 2,
    enabled: !!id,
  })

  // Initialize form with proper default values matching your schema
  const methods = useForm<TsBlog>({
    resolver: zodResolver(blogSchema),
    mode: 'onSubmit',

  })

  const { handleSubmit, reset } = methods

  // Transform and reset form data when blog loads
  useEffect(() => {
    if (blog && blog.id) {
      const transformedData: TsBlog = {
        title: blog.title || '',
        author: blog.author || '',
        content: blog.content || '',
        // Transform image according to your union schema
        image: blog.image_public_id && blog.image_url ? {
          image_public_id: blog.image_public_id as string,
          image_url: blog.image_url as string
        } : { image_public_id: '', image_url: '' },
        // Transform sections array
        sections: blog.sections?.map((section: any) => ({
          title: section.title || '',
          content: section.content || '',
          image: section.image_public_id && section.image_url ? {
            image_public_id: section.image_public_id,
            image_url: section.image_url
          } : null
        })) || []
      }
      
      console.log('Resetting form with:', transformedData) // Debug log
      reset(transformedData)
    }
  }, [blog?.id, blog?.title, blog?.author, blog?.content, blog?.image_public_id, blog?.image_url, blog?.sections, reset])

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
  
  const processImage = async (image: File | { image_public_id: string; image_url: string }) => {
    if (!(image instanceof File)) return image
    const uploaded = await handleImage(image)
    return uploaded
  }


  const updateBlog = async (data: TsBlog) => {
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
    const response = await baseInstance.put(`/blogs/${id}/update`, payload)
    return response.data
  }

  const {mutate,isPending, isSuccess, isError} = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs']})
      router.replace("/blogs")
    },
    onError: (error) => {
      alert(`Update failed: ${error}`)
    }
  })

  const onSubmit = (data: TsBlog) => {
    mutate(data)
  }

  // Early returns for better UX
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600">Error loading blog: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Blog not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Update Blog</h1>
          
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BlogInput title="Title" name="title" placeholder="Enter blog title" />
                  <BlogInput title="Author" name="author" placeholder="Enter author name" />
                </div>

                <TextAreaBlog 
                  title="Main Content" 
                  name="content" 
                  placeholder="Write the main content of your blog..."
                />
                
                <ImageUploader 
                  title="Cover Image" 
                  name="image" 
                  description="Upload a cover image for your blog"
                />
              </div>

              {/* Sections */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Blog Sections</h2>
                <SectionInput />
              </div>
              
              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    'Update Blog'
                  )}
                </button>
                
                <button 
                  type="button"
                  onClick={() => reset()}
                  className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Reset Form
                </button>
              </div>

              {/* Success/Error Messages */}
              {isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  ✅ Blog updated successfully!
                </div>
              )}
              
              {isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  ❌ Failed to update blog. Please try again.
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default UpdatePage
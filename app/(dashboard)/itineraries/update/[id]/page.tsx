'use client'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { motion } from "motion/react"
import { 
  MapPin, 
  Calendar, 
  Plane, 
  Save, 
  ArrowLeft, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"

// Import modular components
import TitleInput from '@/components/pages/itinerary/update/TitleInput'
import PhotoUploader from '@/components/pages/itinerary/update/PhotoUploader'
import ContentEditor from '@/components/pages/itinerary/update/ContentEditor'
import { useToast } from '@/components/ui/ToastContainer'

// Import existing components
import CustomFormInput from '@/components/pages/itinerary/create/CustomFormInput'
import AccommodationDropDown from '@/components/pages/itinerary/create/AccomodationDropDown'
import CostExcludedInput from '@/components/pages/itinerary/create/CostExludedInput'
import CostIncludedInput from '@/components/pages/itinerary/create/CostIncludedInput'
import ItineraryDaysInput from '@/components/pages/itinerary/create/ItineraryDaysInput'
import LocationDropDown from '@/components/pages/itinerary/create/LocationDropDown'
import TagsInput from '@/components/pages/itinerary/create/TagsInput'

// Import API and types
import { baseInstance } from '@/constants/api'
import { ItineraryProps } from '@/constants/propConstants'
import { itineraryUpdateSchema, TsItineraryUpdate } from '@/store/ItineraryUpdateZodStore'

const UpdatePage = () => {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const id = params?.id as string

  // State for tracking changes
  const [originalData, setOriginalData] = useState<any>(null)
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set())
  const [isFormDirty, setIsFormDirty] = useState(false)

  // Fetch existing itinerary data
  const handleFetch = async (id: string) => {
    const response = await baseInstance.get(`/itineraries/${id}`)
    return response.data
  }

  const { data: itinerary, isLoading, error } = useQuery<ItineraryProps>({ 
    queryKey: ['itinerary', id], 
    queryFn: () => handleFetch(id), 
    enabled: !!id,
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 35,
  })

  // Initialize form
  const methods = useForm<TsItineraryUpdate>({
    resolver: zodResolver(itineraryUpdateSchema) as any,
    mode: 'onChange',
  })

  const { handleSubmit, reset, watch, setValue, formState: { isDirty, dirtyFields } } = methods

  // Track field changes
  const handleFieldChange = (field: string, value: any) => {
    setChangedFields(prev => new Set([...prev, field]))
    setIsFormDirty(true)
  }

  // Reset form when itinerary data loads
  useEffect(() => {
    if (itinerary) {
      const defaultValues = {
        title: itinerary.title || '',
        overview: itinerary.overview || '',
        discount: itinerary.discount || 0,
        duration: itinerary.duration || 1,
        price: itinerary.price || 0,
        arrivalCity: itinerary.arrival_city || '',
        departureCity: itinerary.departure_city || '',
        tags: itinerary.tags 
          ? itinerary.tags.split(',').map(tag => ({ name: tag.trim() }))
          : [{ name: "" }],
        accommodation: itinerary.accommodation || 'Budget',
        location: itinerary.location || 'Kenya',
        days: itinerary.days?.map(day => ({
          day: day.day_number,
          title: day.title,
          details: day.details,
          images: []
        })) || [],
        costExclusive: itinerary.cost_exclusive?.map(item => ({ item })) || [{ item: "" }],
        costInclusive: itinerary.cost_inclusive?.map(item => ({ item })) || [{ item: "" }]
      }
      
      setOriginalData(defaultValues)
      reset(defaultValues)
      setChangedFields(new Set())
      setIsFormDirty(false)
    }
  }, [itinerary, reset])

  // Track form changes
  useEffect(() => {
    setIsFormDirty(isDirty)
  }, [isDirty])

  // Handle image uploads
  const handleImagesUpload = async (images: { file: File }[]) => {
    const formData = new FormData()
    
    images.forEach((image) => {
      formData.append("files", image.file)
    })

    const response = await baseInstance.post("/itineraries/upload-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  }

  // Build PATCH payload with only changed fields
  const buildPatchPayload = async (data: TsItineraryUpdate) => {
    const payload: any = {}

    // Handle scalar fields that are dirty
    const scalarFieldMapping = {
      title: 'title',
      duration: 'duration',
      overview: 'overview',
      price: 'price',
      discount: 'discount',
      arrivalCity: 'arrival_city',
      departureCity: 'departure_city',
      accommodation: 'accommodation',
      location: 'location'
    }

    Object.entries(scalarFieldMapping).forEach(([formField, apiField]) => {
      if (dirtyFields[formField as keyof TsItineraryUpdate]) {
        payload[apiField] = data[formField as keyof TsItineraryUpdate]
      }
    })

    // Handle tags if dirty - Fixed: Check for array structure
    if (dirtyFields.tags && data.tags) {
      payload.tags = data.tags
        .map(tag => tag.name)
        .filter(name => name && name.trim() !== '')
        .map(name => ({ name: name.trim() })) // Backend expects array of tag objects
    }

    // Handle cost arrays if dirty - Fixed: Extract item values
    if (dirtyFields.costInclusive && data.costInclusive) {
      payload.cost_inclusive = data.costInclusive
        .map(item => item.item)
        .filter(item => item && item.trim() !== '')
    }

    if (dirtyFields.costExclusive && data.costExclusive) {
      payload.cost_exclusive = data.costExclusive
        .map(item => item.item)
        .filter(item => item && item.trim() !== '')
    }

    // Handle main images if provided and dirty
    if (dirtyFields.images && data.images?.length) {
      // Filter only file uploads (new images)
      const fileImages = data.images.filter(img => 'file' in img) as { file: File }[]
      if (fileImages.length > 0) {
        const uploadedImages = await handleImagesUpload(fileImages)
        payload.images = uploadedImages
      }
    }

    // Handle days if dirty - Fixed: Process day images properly
    if (dirtyFields.days && data.days) {
      const processedDays = await Promise.all(
        data.days.map(async (day) => {
          let dayImageUrls: any[] = []
          if (day.images && day.images.length > 0) {
            // Filter file uploads
            const fileImages = day.images.filter(img => 'file' in img) as { file: File }[]
            if (fileImages.length > 0) {
              dayImageUrls = await handleImagesUpload(fileImages)
            }
          }
          return {
            day: day.day,
            title: day.title,
            details: day.details,
            images: dayImageUrls
          }
        })
      )
      payload.days = processedDays
    }

    return payload
  }

  // Update itinerary function - PATCH request
  const updateItinerary = async (data: TsItineraryUpdate) => {
    try {
      const payload = await buildPatchPayload(data)

      // Only proceed if there are changes to send
      if (Object.keys(payload).length === 0) {
        throw new Error("No changes detected to update")
      }

      console.log('Sending payload:', payload) // Debug log

      const response = await baseInstance.patch(`/itineraries/update/${id}`, payload)
      if (response.status !== 200) {
        throw new Error("Failed to update itinerary")
      }
      
      return response.data
    } catch (error: any) {
      console.error('Update error details:', error.response?.data || error)
      throw error
    }
  }

  const { mutate: updateMutation, isPending } = useMutation({
    mutationFn: updateItinerary,
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['itinerary', id] })
      queryClient.invalidateQueries({ queryKey: ['itineraries'] })
      
      // Show success toast
      showToast({
        type: 'success',
        title: 'Itinerary Updated Successfully!',
        message: `Updated ${data.updated_count || 0} field(s)`,
        duration: 5000
      })
      
      // Reset form dirty state
      setIsFormDirty(false)
      setChangedFields(new Set())
    },
    onError: (error: any) => {
      console.error("Update Error:", error.response?.data || error.message)
      
      let errorMessage = "An unexpected error occurred. Please try again."
      
      if (error.response?.status === 400) {
        const detail = error.response?.data?.detail
        errorMessage = detail || "Update failed. Please check all required fields."
      } else if (error.response?.status === 401) {
        errorMessage = "You are not authorized to update this itinerary."
      } else if (error.response?.status === 404) {
        errorMessage = "Itinerary not found."
        router.push("/itineraries")
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message) {
        errorMessage = error.message
      }

      showToast({
        type: 'error',
        title: 'Update Failed',
        message: errorMessage,
        duration: 7000
      })
    },
  })

  const onSubmit = async (data: TsItineraryUpdate) => {
    console.log('Form data:', data) // Debug log
    updateMutation(data)
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load itinerary</p>
          <button 
            onClick={() => router.push('/itineraries')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Itineraries
          </button>
        </div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Itinerary not found</p>
          <button 
            onClick={() => router.push('/itineraries')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Itineraries
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Update Itinerary
            </h1>
            <p className="text-lg text-gray-600">
              Editing: {itinerary.title}
            </p>
            {isFormDirty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
              >
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                {changedFields.size} field(s) modified
              </motion.div>
            )}
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
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
                  <p className="text-sm text-gray-600">Update essential details about the trip</p>
                </div>
              </div>

              <div className="space-y-6">
                <TitleInput 
                  currentValue={originalData?.title}
                  onFieldChange={handleFieldChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomFormInput title='Duration (days)' name='duration' placeholder='7' type='number' />
                  <CustomFormInput title='Arrival City' name='arrivalCity' placeholder='Nairobi' />
                  <CustomFormInput title='Departure City' name='departureCity' placeholder='Mombasa' />
                  <CustomFormInput title='Price (USD)' name='price' placeholder='2500' type='number' />
                </div>

                <CustomFormInput title='Discount % (Optional)' name='discount' placeholder='e.g., 10' type='number'/>
                <ContentEditor 
                  currentValue={originalData?.overview}
                  onFieldChange={handleFieldChange}
                />
              </div>
            </section>

            {/* Images Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 text-lg">🖼️</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                  <p className="text-sm text-gray-600">Update itinerary images (optional - only upload if you want to replace all images)</p>
                </div>
              </div>
              <PhotoUploader 
                currentImages={itinerary.images}
                onImagesChange={(images) => handleFieldChange('images', images)}
              />
            </section>

            {/* Destination & Preferences Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Destination & Preferences</h2>
                  <p className="text-sm text-gray-600">Update the destination and accommodation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LocationDropDown />
                <AccommodationDropDown />
              </div>
            </section>

            {/* Tags & Days Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Organization & Planning</h2>
                  <p className="text-sm text-gray-600">Update tags and daily activities</p>
                </div>
              </div>

              <div className="space-y-8">
                <TagsInput />
                <ItineraryDaysInput />
              </div>
            </section>

            {/* Cost Information Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">$</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cost Information</h2>
                  <p className="text-sm text-gray-600">Update what's included and excluded</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CostIncludedInput />
                <CostExcludedInput />
              </div>
            </section>

            {/* Submit Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Ready to Update?</h3>
                  <p className="text-sm text-gray-600">
                    {isFormDirty 
                      ? `You have ${changedFields.size} modified field(s) - review and update the itinerary`
                      : "No changes detected - make some edits to update"
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isFormDirty && confirm('Are you sure you want to discard your changes?')) {
                        reset(originalData)
                        setIsFormDirty(false)
                        setChangedFields(new Set())
                      } else if (!isFormDirty) {
                        router.back()
                      }
                    }}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200"
                  >
                    {isFormDirty ? 'Discard Changes' : 'Cancel'}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isPending || !isFormDirty}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 ${
                      isPending || !isFormDirty
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Itinerary
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
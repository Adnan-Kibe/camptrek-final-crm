'use client'
import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'
import { Plus, Trash2, UserPlus, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// Validation schema for staff creation
const StaffSchema = z.object({
  staff: z.array(z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address').refine(
      (email) => email.includes('@') && email.includes('.') && email.split('@')[1].includes('.'),
      'Please enter a complete email address (e.g., user@domain.com)'
    )
  })).min(1, 'At least one staff member is required')
})

// Type for individual staff member
type StaffMember = {
  first_name: string
  last_name: string
  email: string
}

type StaffFormData = z.infer<typeof StaffSchema>

const StaffCreationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const queryClient = useQueryClient()

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<StaffFormData>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      staff: [
        { first_name: '', last_name: '', email: '' }
      ]
    },
    mode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'staff'
  })

  // Create staff mutation
  const createStaffMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      console.log('Full form data:', data)
      console.log('Staff array being sent:', data.staff)
      console.log('JSON.stringify of staff array:', JSON.stringify(data.staff, null, 2))
      
      // Validate the data structure matches exactly what backend expects
      const staffArray = data.staff.map(member => ({
        first_name: member.first_name.trim(),
        last_name: member.last_name.trim(),
        email: member.email.trim()
      }))
      
      console.log('Processed staff array:', staffArray)
      console.log('Final JSON payload:', JSON.stringify(staffArray, null, 2))
      
      console.log('Request headers:', baseInstance.defaults.headers)
      console.log('Sending request to:', '/staff/create')
      console.log('Request payload:', staffArray)
      
      try {
        console.log('Attempting to create staff...')
        const response = await baseInstance.post('/staff/create', staffArray)
        console.log('Response received:', response)
        return response.data
      } catch (error: any) {
        console.error('API call failed:', error)
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          config: error.config
        })
        throw error
      }
    },
    onSuccess: () => {
      setSubmitStatus('success')
      setIsSubmitting(false)
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      // Reset form after successful submission
      setTimeout(() => {
        reset()
        setSubmitStatus('idle')
      }, 3000)
    },
    onError: (error: any) => {
      setSubmitStatus('error')
      console.error('Staff creation error:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error response status:', error.response?.status)
      console.error('Error response headers:', error.response?.headers)
      
      // More detailed error handling
      let errorMsg = 'Failed to create staff members'
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid data provided. Please check all fields are filled correctly.'
      } else if (error.response?.status === 401) {
        errorMsg = 'Authentication required. Please log in again.'
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.'
      }
      
      setErrorMessage(errorMsg)
      setIsSubmitting(false)
    }
  })

  const onSubmit = async (data: StaffFormData) => {
    console.log('Form submitted with data:', data)
    console.log('Staff array:', data.staff)
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      await createStaffMutation.mutateAsync(data)
    } catch (error) {
      console.error('Submit error:', error)
      // Error is handled in onError callback
    }
  }

  const addStaffMember = () => {
    append({ first_name: '', last_name: '', email: '' })
  }

  const removeStaffMember = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const watchedFields = watch('staff')

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Staff Members</h2>
        <p className="text-gray-600">Add multiple team members to your safari organization</p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Staff Created Successfully!</h3>
              <p className="text-green-700 text-sm">New staff members have been added to your organization.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Error Creating Staff</h3>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Staff Creation Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Staff Members List */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Staff Member {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStaffMember(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Remove staff member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    {...control.register(`staff.${index}.first_name` as const)}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.staff?.[index]?.first_name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.staff?.[index]?.first_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {errors.staff[index]?.first_name?.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    {...control.register(`staff.${index}.last_name` as const)}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.staff?.[index]?.last_name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.staff?.[index]?.last_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {errors.staff[index]?.last_name?.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...control.register(`staff.${index}.email` as const)}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.staff?.[index]?.email 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.staff?.[index]?.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {errors.staff[index]?.email?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Staff Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addStaffMember}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-orange-400 hover:text-orange-600 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Another Staff Member
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Staff...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create {fields.length} Staff Member{fields.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Form Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">{fields.length}</span>
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Ready to Create</h3>
              <p className="text-blue-700 text-sm">
                {fields.length === 1 
                  ? '1 staff member will be created'
                  : `${fields.length} staff members will be created`
                }
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default StaffCreationForm


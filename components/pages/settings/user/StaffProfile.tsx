'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'
import { useStaffStore } from '@/store/StaffStore'
import { User, Mail, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

// Validation schema for staff profile update
const StaffProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal(''))
})

type StaffProfileData = z.infer<typeof StaffProfileSchema>

interface StaffProfileResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

const StaffProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const { id, email, name, role, setData } = useStaffStore()
  const queryClient = useQueryClient()

  // Fetch current staff profile data
  const { data: staffProfile, isLoading, error } = useQuery<StaffProfileResponse>({
    queryKey: ['staff-profile'],
    queryFn: async () => {
      console.log('Fetching staff profile from /staff/me endpoint')
      const response = await baseInstance.get('/staff/me')
      console.log('Staff profile response:', response.data)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<StaffProfileData>({
    resolver: zodResolver(StaffProfileSchema),
    defaultValues: {
      first_name: staffProfile?.first_name || '',
      last_name: staffProfile?.last_name || '',
      email: staffProfile?.email || '',
      password: ''
    },
    mode: 'onChange'
  })

  // Update form when staff profile data is loaded
  React.useEffect(() => {
    if (staffProfile) {
      reset({
        first_name: staffProfile.first_name,
        last_name: staffProfile.last_name,
        email: staffProfile.email,
        password: ''
      })
    }
  }, [staffProfile, reset])

  // Update staff profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: StaffProfileData) => {
      console.log('Updating staff profile:', data)
      
      // Build payload with only changed fields (partial update)
      const payload: any = {}
      
      // Only include fields that have changed from the original data
      if (staffProfile) {
        if (data.first_name.trim() !== staffProfile.first_name) {
          payload.first_name = data.first_name.trim()
        }
        if (data.last_name.trim() !== staffProfile.last_name) {
          payload.last_name = data.last_name.trim()
        }
        if (data.email.trim() !== staffProfile.email) {
          payload.email = data.email.trim()
        }
        // Always include password if provided (since we can't compare it)
        if (data.password && data.password.length > 0) {
          payload.password = data.password
        }
      } else {
        // Fallback: include all fields if no original data
        payload.first_name = data.first_name.trim()
        payload.last_name = data.last_name.trim()
        payload.email = data.email.trim()
        if (data.password && data.password.length > 0) {
          payload.password = data.password
        }
      }

      console.log('Profile update payload (partial):', payload)
      
      // Don't send request if no fields have changed
      if (Object.keys(payload).length === 0) {
        throw new Error('No changes detected')
      }
      
      const response = await baseInstance.patch('/staff/me', payload)
      console.log('Profile update response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Success callback received data:', data)
      setSubmitStatus('success')
      setIsSubmitting(false)
      
      // Extract staff data from response
      const staffData = data.staff || data
      console.log('Extracted staff data:', staffData)
      
      // Update the staff store with new data
      try {
        setData(
          staffData.id?.toString() || id,
          staffData.email || email,
          `${staffData.first_name || ''} ${staffData.last_name || ''}`.trim() || name,
          staffData.role || role
        )
        console.log('Staff store updated successfully')
      } catch (error) {
        console.error('Error updating staff store:', error)
        // Continue with form reset even if store update fails
      }
      
      // Reset form
      reset({
        first_name: staffData.first_name || '',
        last_name: staffData.last_name || '',
        email: staffData.email || '',
        password: ''
      })
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 3000)
    },
    onError: (error: any) => {
      setSubmitStatus('error')
      console.error('Profile update error:', error)
      
      let errorMsg = 'Failed to update profile'
      
      // Handle "no changes" case
      if (error.message === 'No changes detected') {
        errorMsg = 'No changes detected. Please modify at least one field.'
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error
      } else if (error.response?.data?.detail) {
        errorMsg = error.response.data.detail
      } else if (error.response?.status === 400) {
        errorMsg = 'Invalid data provided. Please check all fields.'
      } else if (error.response?.status === 401) {
        errorMsg = 'Invalid credentials. Please check your password.'
      } else if (error.response?.status === 403) {
        errorMsg = 'You do not have permission to update this profile.'
      } else if (error.response?.status === 409) {
        errorMsg = 'Email address is already in use. Please choose a different email.'
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.'
      }
      
      setErrorMessage(errorMsg)
      setIsSubmitting(false)
    }
  })

  const onSubmit = async (data: StaffProfileData) => {
    console.log('Profile form submitted:', data)
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      await updateProfileMutation.mutateAsync(data)
    } catch (error) {
      console.error('Submit error:', error)
      // Error is handled in onError callback
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="bg-gray-100 rounded-xl p-6 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Profile</h3>
        <p className="text-gray-600">Unable to load your profile information. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">Manage your personal information and account settings</p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-800">Profile Updated Successfully!</h3>
              <p className="text-green-700 text-sm">Your profile information has been updated.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-800">Error Updating Profile</h3>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Information Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-medium text-blue-800 mb-4">Current Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">Name</p>
              <p className="font-medium text-blue-900">{staffProfile?.first_name} {staffProfile?.last_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">Email</p>
              <p className="font-medium text-blue-900">{staffProfile?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">Role</p>
              <p className="font-medium text-blue-900 capitalize">{staffProfile?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700">Member Since</p>
              <p className="font-medium text-blue-900">
                {staffProfile?.created_at ? new Date(staffProfile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Update Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Update Profile Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                {...register('first_name')}
                type="text"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.first_name 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                {...register('last_name')}
                type="text"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.last_name 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-4">Password</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password (optional)
              </label>
              <input
                {...register('password')}
                type="password"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Enter new password (leave blank to keep current)"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating Profile...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StaffProfile

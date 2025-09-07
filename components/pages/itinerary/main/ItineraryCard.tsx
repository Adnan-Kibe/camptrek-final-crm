'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MapPin, Calendar, Users, Percent, Edit, Trash2, AlertTriangle } from 'lucide-react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { baseInstance } from '@/constants/api'
import { ItineraryProps } from '@/constants/propConstants'
import DeleteConfirmationDialog from '@/components/global/DeleteDialog/DeleteConfirmationDialog'

const ItineraryCard = ({id, title, duration, overview, images, price, tags, arrival_city, departure_city, accommodation, location, discount} : ItineraryProps) => {

  const router = useRouter()
  const queryClient = useQueryClient()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the view details click
    router.push(`/itineraries/update/${id}`)
  }

  // Delete mutation with proper React Query integration
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await baseInstance.delete(`/itineraries/${id}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate the itineraries query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['itineraries'] })
      console.log('✅ Itinerary deleted successfully')
      setDeleteDialogOpen(false)
    },
    onError: (error: any) => {
      console.error('❌ Delete error:', error)
      // You could add a toast notification here instead of alert
      alert('Failed to delete itinerary. Please try again.')
    }
  })

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the view details click
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(id)
  }

  const discountedPrice = discount > 0 ? price - (price * discount / 100) : price
  const tagArray = tags ? tags.split(',').slice(0, 3) : []

  return (
    <>
      <div className='group bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden max-w-sm hover:border-gray-300'>

        {images && images.length > 0 ? 
        (
          <div className='relative h-40 w-full overflow-hidden'>
            <Image 
              src={images[0].image_url} 
              alt={title} 
              fill 
              className='object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300' 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                <Percent size={12} />
                {discount}% OFF
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
            <MapPin size={32} className="text-gray-400" />
          </div>
        )}

        <div className='p-4 space-y-3'>
          {/* Title and Location */}
          <div>
            <h1 className='text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors'>
              {title}
            </h1>
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <MapPin size={12} className="mr-1 text-primary" />
              <span>{arrival_city} → {departure_city}</span>
              <span className="mx-2">•</span>
              <span>{location}</span>
            </div>
          </div>

          {/* Overview */}
          <p className='text-xs text-gray-600 line-clamp-2 leading-relaxed'>{overview}</p>
          
          {/* Duration and Accommodation */}
          <div className='flex items-center justify-between text-xs text-gray-600'>
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-green-500" />
              <span className="font-medium">{duration} days</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} className="text-purple-500" />
              <span className="font-medium truncate max-w-24">{accommodation}</span>
            </div>
          </div>

          {/* Tags */}
          {tagArray.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tagArray.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium border border-primary/20"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
            <div className="flex items-center gap-1">
              {discount > 0 ? (
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-green-600">
                    ${discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ${price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-green-600">
                  ${price.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className='flex gap-2'>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-blue-500 hover:bg-blue-600 py-2 px-3 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors duration-200 flex items-center justify-center gap-1'
              onClick={handleEdit}
              disabled={deleteMutation.isPending}
            >
              <Edit size={14} />
              Edit
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium cursor-pointer transition-colors duration-200 flex items-center justify-center gap-1 ${
                deleteMutation.isPending 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={handleDeleteClick}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={14} />
              Delete
            </motion.button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        title="Delete Itinerary"
        itemName={title}
        itemType="Itinerary"
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
  )
}

export default ItineraryCard
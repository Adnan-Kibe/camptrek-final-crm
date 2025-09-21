'use client'

import { baseInstance } from '@/constants/api'
import { ItineraryProps } from '@/constants/propConstants'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React from 'react'

const UpdatePage = () => {
  const params = useParams()
  const id = params.id as string;

  const handleFetch = async (id: string) => {
    const response = await baseInstance.get(`/itineraries/${id}`)
    return response.data
  }

  const { data: itinerary, isLoading, error } = useQuery<ItineraryProps>({ 
    queryKey: ['itinerary', id], 
    queryFn: () => handleFetch(id), 
    enabled: !!id,
  })

  console.log(itinerary)
  return (
    <div>page</div>
  )
}

export default UpdatePage
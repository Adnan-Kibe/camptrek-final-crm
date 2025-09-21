'use client'

import CustomFormInput from '@/components/pages/itinerary/create/CustomFormInput'
import { baseInstance } from '@/constants/api'
import { ItineraryProps } from '@/constants/propConstants'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

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

  const methods = useForm()
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if(itinerary)
      reset(itinerary)
  }, [reset, itinerary])

  const onSubmit = async (data: any) => {}

  return (
    <div>
      <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomFormInput title="Trip Title" name="title" placeholder="e.g., Amazing Safari" />
          </form>
      </FormProvider>
    </div>
  )
}

export default UpdatePage
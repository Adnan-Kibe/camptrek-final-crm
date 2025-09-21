'use client'

import CustomFormInput from '@/components/pages/itinerary/create/CustomFormInput'
import ItineraryTextArea from '@/components/pages/itinerary/create/ItineraryTextArea'
import { baseInstance } from '@/constants/api'
import { ItineraryProps } from '@/constants/propConstants'
import { UpdateItinerary, UpdateItinerarySchema } from '@/store/ItineraryUpdateZodStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
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

  const methods = useForm<UpdateItinerary>({
    resolver: zodResolver(UpdateItinerarySchema),
    defaultValues: {
      title: itinerary?.title,
      overview: itinerary?.overview,
      tags: itinerary?.tags,
      duration: itinerary?.duration,
      discount: itinerary?.discount,
      arrival_city: itinerary?.arrival_city,
      departure_city: itinerary?.departure_city,
      location: itinerary?.location,
      price: itinerary?.price,
      accommodation: itinerary?.accommodation,
      images: itinerary?.images,
      days: itinerary?.days,
      cost_exclusive: itinerary?.cost_exclusive,
      cost_inclusive: itinerary?.cost_inclusive
    }
  })
  const { handleSubmit, reset } = methods

  useEffect(() => {
    if(itinerary)
      reset(itinerary)
  }, [reset, itinerary])

  const { mutate } = useMutation({})

  const onSubmit = async (data: UpdateItinerary) => {}

  return (
    <div>
      <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomFormInput title="Trip Title" name="title" placeholder="e.g., Amazing Safari" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomFormInput
                    title="Duration (days)"
                    name="duration"
                    placeholder="7"
                    type="number"
                  />
                  <CustomFormInput
                    title="Arrival City"
                    name="arrivalCity"
                    placeholder="Nairobi"
                  />
                  <CustomFormInput
                    title="Departure City"
                    name="departureCity"
                    placeholder="Mombasa"
                  />
                  <CustomFormInput
                    title="Price (USD)"
                    name="price"
                    placeholder="2500"
                    type="number"
                  />
                </div>

                <CustomFormInput
                  title="Discount % (Optional)"
                  name="discount"
                  placeholder="e.g., 10"
                  type="number"
                />
                <ItineraryTextArea name="overview" title="Trip Overview" />
          </form>
      </FormProvider>
    </div>
  )
}

export default UpdatePage
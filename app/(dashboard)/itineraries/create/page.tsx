"use client"

import AccommodationDropDown from "@/components/pages/itinerary/newCreate/AccommodationDropDown"
import DaysInput from "@/components/pages/itinerary/newCreate/DaysInput"
import ExcludedInput from "@/components/pages/itinerary/newCreate/ExcludedInput"
import IncludedInput from "@/components/pages/itinerary/newCreate/IncludedInput"
import MapUploader from "@/components/pages/itinerary/newCreate/MapUploader"
import MultipleImageUploader from "@/components/pages/itinerary/newCreate/MultipleImageUploader"
import NewFormInput from "@/components/pages/itinerary/newCreate/NewFormInput"
import TagsInput from "@/components/pages/itinerary/newCreate/TagsInput"
import TextAreaInput from "@/components/pages/itinerary/newCreate/TextAreaInput"
import { safariTs, safariZodStore } from "@/store/SafariZodStore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

const NewCreatePage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const method = useForm<safariTs>({
    resolver: zodResolver(safariZodStore),
  })

  const { handleSubmit } = method

  const createItinerary = async (data: safariTs) => {
    console.log(data)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] })
      router.push("/itineraries")
    },
    onError: () => {},
  })

  const onSubmit = async (data: safariTs) => {
    mutate(data)
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Create New Itinerary
        </h1>

        <FormProvider {...method}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Basic Information
              </h2>
              <NewFormInput title="Title" name="title" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NewFormInput title="Arrival City" name="arrivalCity" />
                <NewFormInput title="Departure City" name="departureCity" />
                <NewFormInput title="Price" name="price" type="number" />
                <NewFormInput title="Discount" name="discount" type="number" />
              </div>

              <TextAreaInput title="Overview" name="overview" />
            </section>

            {/* Media Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Media
              </h2>
              <MapUploader />
              <MultipleImageUploader />
            </section>

            {/* Details Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                Details
              </h2>
              <NewFormInput title="Location" name="location" />
              <AccommodationDropDown />
              <DaysInput />
              <TagsInput />
            </section>

            {/* Inclusions / Exclusions */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncludedInput />
              <ExcludedInput />
            </section>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                {isPending ? "Submitting..." : "Submit Itinerary"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default NewCreatePage

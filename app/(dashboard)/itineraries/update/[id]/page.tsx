"use client";

import AccommodationDropDown from "@/components/pages/itinerary/create/AccomodationDropDown";
import CustomFormInput from "@/components/pages/itinerary/create/CustomFormInput";
import ItineraryTextArea from "@/components/pages/itinerary/create/ItineraryTextArea";
import TagsInput from "@/components/pages/itinerary/create/TagsInput";
import CostExcludedUpdate from "@/components/pages/itinerary/update/CostExcludedUpdate";
import CostIncludedUpdate from "@/components/pages/itinerary/update/CostIncludedUpdate";
import { baseInstance } from "@/constants/api";
import { ItineraryProps } from "@/constants/propConstants";
import {
  UpdateItinerary,
  UpdateItinerarySchema,
} from "@/store/ItineraryUpdateZodStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "motion/react";
import { MapPin, Calendar, Plane, Save } from "lucide-react";

const UpdatePage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  // fetch itinerary
  const handleFetch = async (id: string) => {
    const response = await baseInstance.get(`/itineraries/${id}`);
    return response.data;
  };

  const { data: itinerary, isLoading, error } = useQuery<ItineraryProps>({
    queryKey: ["itinerary", id],
    queryFn: () => handleFetch(id),
    enabled: !!id,
  });

  const methods = useForm<UpdateItinerary>({
    resolver: zodResolver(UpdateItinerarySchema),
    defaultValues: {},
  });

  const { handleSubmit, reset } = methods;

  // hydrate form when itinerary arrives
  useEffect(() => {
    if (itinerary) {
      reset({
        title: itinerary.title,
        overview: itinerary.overview,
        tags: itinerary.tags
          ? itinerary.tags.split(",").map((tag) => ({ name: tag.trim() }))
          : [],
        duration: itinerary.duration,
        discount: itinerary.discount,
        arrival_city: itinerary.arrival_city,
        departure_city: itinerary.departure_city,
        location: itinerary.location,
        price: itinerary.price,
        accommodation: itinerary.accommodation,
        images: itinerary.images,
        days: itinerary.days,
        cost_exclusive: itinerary.cost_exclusive,
        cost_inclusive: itinerary.cost_inclusive,
      });
    }
  }, [itinerary, reset]);

  const updateItinerary = async (data: UpdateItinerary) => {
    const response = await baseInstance.patch(`/itineraries/update/${id}`, data);
    if (response.status !== 200) throw new Error("Failed to update itinerary");
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      router.push("/itineraries");
    },
    onError: (error: any) => {
      console.error("Update Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to update itinerary. Please try again."
      );
    },
  });

  const onSubmit = (data: UpdateItinerary) => {
    mutate(data);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Itinerary
          </h1>
          {itinerary && <p className="text-lg text-gray-600">Title: {itinerary.title}</p> }
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Basic Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Essential details about the trip
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <CustomFormInput
                  title="Trip Title"
                  name="title"
                  placeholder="e.g., Amazing Safari"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <CustomFormInput
                    title="Duration (days)"
                    name="duration"
                    placeholder="7"
                    type="number"
                  />
                  <CustomFormInput
                    title="Arrival City"
                    name="arrival_city"
                    placeholder="Nairobi"
                  />
                  <CustomFormInput
                    title="Departure City"
                    name="departure_city"
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
              </div>
            </section>

            {/* Destination & Preferences */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Destination & Preferences
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose the destination and accommodation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomFormInput title="Location" name="location" placeholder="Kenya" />
                <AccommodationDropDown />
              </div>
            </section>

            {/* Tags */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Organization & Planning
                  </h2>
                  <p className="text-sm text-gray-600">Update tags</p>
                </div>
              </div>

              <TagsInput />
            </section>

            {/* Cost Info */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">$</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cost Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Update what's included and excluded
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CostIncludedUpdate />
                <CostExcludedUpdate />
              </div>
            </section>

            {/* Submit */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Update?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click below to save your changes
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isPending}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    !isPending
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer"
                      : "bg-gray-400 text-white cursor-not-allowed"
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
                      Update Itinerary
                    </>
                  )}
                </motion.button>
              </div>
            </section>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default UpdatePage;

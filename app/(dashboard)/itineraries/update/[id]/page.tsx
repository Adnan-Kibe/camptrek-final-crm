"use client";

import AccommodationDropDown from "@/components/pages/itinerary/create/AccomodationDropDown";
import CustomFormInput from "@/components/pages/itinerary/create/CustomFormInput";
import ItineraryTextArea from "@/components/pages/itinerary/create/ItineraryTextArea";
import TagsInput from "@/components/pages/itinerary/create/TagsInput";
import CostExcludedUpdate from "@/components/pages/itinerary/update/CostExcludedUpdate";
import CostIncludedUpdate from "@/components/pages/itinerary/update/CostIncludedUpdate";
import { baseInstance } from "@/constants/api";
import { ItineraryProps } from "@/constants/propConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Calendar, Plane, Save, AlertCircle, CheckCircle } from "lucide-react";
import { UpdateItinerary, UpdateItinerarySchema } from "@/store/ItineraryUpdateZodStore";

const UpdatePage = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

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

  const { handleSubmit, reset, formState: { errors } } = methods;

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
        discount: itinerary.discount || 0,
        arrival_city: itinerary.arrival_city,
        departure_city: itinerary.departure_city,
        location: itinerary.location,
        price: itinerary.price,
        accommodation: itinerary.accommodation,
        cost_exclusive: itinerary.cost_exclusive || [],
        cost_inclusive: itinerary.cost_inclusive || [],
      });
    }
  }, [itinerary, reset]);

  const updateItinerary = async (data: UpdateItinerary) => {
    // Transform the data to match backend expectations
    const transformedData: any = {
      ...(data.title && { title: data.title }),
      ...(data.overview && { overview: data.overview }),
      ...(data.duration !== undefined && { duration: Number(data.duration) }),
      ...(data.price !== undefined && { price: Number(data.price) }),
      ...(data.discount !== undefined && { discount: Number(data.discount) }),
      ...(data.arrival_city && { arrival_city: data.arrival_city }),
      ...(data.departure_city && { departure_city: data.departure_city }),
      ...(data.location && { location: data.location }),
      ...(data.accommodation && { accommodation: data.accommodation }),
    };

    // Handle tags - backend expects array of objects with 'name' field
    if (data.tags && data.tags.length > 0) {
      transformedData.tags = data.tags.map(tag => ({
        name: typeof tag === 'string' ? tag : tag.name
      }));
    }

    // Handle cost arrays - ensure they're arrays of strings
    if (data.cost_inclusive) {
      transformedData.cost_inclusive = data.cost_inclusive.filter(item => item && item.trim());
    }
    if (data.cost_exclusive) {
      transformedData.cost_exclusive = data.cost_exclusive.filter(item => item && item.trim());
    }


    const response = await baseInstance.patch(`/itineraries/update/${id}`, transformedData);
    
    if (response.status !== 200) {
      throw new Error(response.data?.detail || "Failed to update itinerary");
    }
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateItinerary,
    onSuccess: (data) => {
      setUpdateSuccess(true);
      setUpdateError(null);
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      queryClient.invalidateQueries({ queryKey: ["itinerary", id] });
      
      // Show success message for 3 seconds before redirecting
      setTimeout(() => {
        router.push("/itineraries");
      }, 3000);
    },
    onError: (error: any) => {
      console.error("Update Error:", error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.message || 
                          "Failed to update itinerary. Please try again.";
      setUpdateError(errorMessage);
      setUpdateSuccess(false);
      
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const onSubmit = (data: UpdateItinerary) => {
    setUpdateError(null);
    setUpdateSuccess(false);
    mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Itinerary</h2>
          <p className="text-gray-600 mb-4">Could not fetch the itinerary data.</p>
          <button
            onClick={() => router.push("/itineraries")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Itineraries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Itinerary
          </h1>
          {itinerary && <p className="text-lg text-gray-600">Editing: {itinerary.title}</p>}
        </div>
      </div>

      {/* Error/Success Alerts */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <AnimatePresence mode="wait">
          {updateError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 mb-1">Update Failed</h3>
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {updateSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Success!</h3>
                  <p className="text-sm text-green-700">Itinerary updated successfully. Redirecting...</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800 mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <span className="font-medium">{field.replace(/_/g, ' ')}</span>: {
                        typeof error === 'object' && error?.message 
                          ? error.message 
                          : 'Invalid input'
                      }
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
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
                  disabled={isPending || updateSuccess}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    isPending || updateSuccess
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : updateSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Updated Successfully
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
"use client";

import AccommodationDropDown from "@/components/pages/itinerary/create/AccommodationDropDown";
import DaysInput from "@/components/pages/itinerary/create/DaysInput";
import ExcludedInput from "@/components/pages/itinerary/create/ExcludedInput";
import IncludedInput from "@/components/pages/itinerary/create/IncludedInput";
import MapUploader from "@/components/pages/itinerary/create/MapUploader";
import MultipleImageUploader from "@/components/pages/itinerary/create/MultipleImageUploader";
import NewFormInput from "@/components/pages/itinerary/create/NewFormInput";
import TagsInput from "@/components/pages/itinerary/create/TagsInput";
import TextAreaInput from "@/components/pages/itinerary/create/TextAreaInput";
import { safariTs, safariZodStore } from "@/store/SafariZodStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "motion/react";
import { MapPin, Calendar, Plane, Save, Images } from "lucide-react";

const NewCreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const methods = useForm<safariTs>({
    resolver: zodResolver(safariZodStore),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isValid },
    watch
  } = methods;

  const createItinerary = async (data: safariTs) => {
    console.log("Saved: ",data);
  };

  console.log(watch())

  const { mutate, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      // router.push("/itineraries");
    },
  });

  const onSubmit = (data: safariTs) => {
    mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Itinerary
          </h1>
          <p className="text-lg text-gray-600">Plan the perfect adventure</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Basic Info */}
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
                <NewFormInput title="Title" name="title" />
                <div className="grid grid-cols-5 gap-6">
                  <NewFormInput title="Duration" name="duration" type="number" />
                  <NewFormInput title="Arrival City" name="arrivalCity" />
                  <NewFormInput title="Departure City" name="departureCity" />
                  <NewFormInput title="Price" name="price" type="number" />
                  <NewFormInput title="Discount" name="discount" type="number" />
                </div>
                <TextAreaInput title="Overview" name="overview" />
              </div>
            </section>

            {/* Media */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Images className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Media</h2>
                  <p className="text-sm text-gray-600">
                    Add maps and trip images
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <MapUploader />
                <MultipleImageUploader />
              </div>
            </section>

            {/* Details */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    Destination, accommodation, and tags
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Location & Accommodation on same line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NewFormInput
                    title="Location"
                    name="location"
                    placeholder="Enter destination"
                  />
                  <AccommodationDropDown />
                </div>

                {/* Tags */}
                <TagsInput />

                {/* Days */}
                <DaysInput />
              </div>
            </section>

            {/* Inclusions / Exclusions */}
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
                    Specify what's included and excluded
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <IncludedInput />
                <ExcludedInput />
              </div>
            </section>

            {/* Submit */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ready to Create?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click the button below to create your itinerary
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isPending || !isValid}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center gap-2 ${
                    !isPending
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md cursor-pointer"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit Itinerary
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

export default NewCreatePage;

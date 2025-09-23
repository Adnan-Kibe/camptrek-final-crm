"use client";
import AccommodationDropDown from "@/components/pages/itinerary/create/AccomodationDropDown";
import CostExcludedInput from "@/components/pages/itinerary/create/CostExludedInput";
import CostIncludedInput from "@/components/pages/itinerary/create/CostIncludedInput";
import CustomFormInput from "@/components/pages/itinerary/create/CustomFormInput";
import ItineraryDaysInput from "@/components/pages/itinerary/create/ItineraryDaysInput";
import ItineraryImageUploader from "@/components/pages/itinerary/create/ItineraryImageUploader";
import ItineraryTextArea from "@/components/pages/itinerary/create/ItineraryTextArea";
import LocationDropDown from "@/components/pages/itinerary/create/LocationDropDown";
import TagsInput from "@/components/pages/itinerary/create/TagsInput";
import { itinerarySchema, TsItinerarySchema } from "@/store/ItineraryZodStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { motion } from "motion/react";
import { MapPin, Calendar, Plane, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { baseInstance } from "@/constants/api";

type imageProp = {
  image_url: string;
  image_public_id: string;
};

const CreatePage = () => {
  const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const shouldShowDebugInfo = ENVIRONMENT === "development";

  const methods = useForm<TsItinerarySchema>({
    resolver: zodResolver(itinerarySchema) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      overview: "",
      tags: [],
      arrivalCity: "",
      departureCity: "",
      accommodation: "Budget",
      location: "Kenya",
      costIncluded: [],
      costExcluded: [],
      discount: 0,
      images: [],
      duration: 0,
      price: 0,
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = methods;
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleImagesUpload = async (images: { file: File }[]) => {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append("files", image.file); // must match the backend param name
    });

    const response = await baseInstance.post(
      "/itineraries/upload-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  const createItinerary = async (data: TsItinerarySchema) => {
    const itineraryImages = await handleImagesUpload(data.images);
    const processedDays = await Promise.all(
      data.days.map(async (day) => {
        let dayImageUrls: imageProp[] = [];
        if (day.images && day.images.length > 0) {
          dayImageUrls = await handleImagesUpload(day.images);
        }
        return {
          day: day.day,
          title: day.title,
          details: day.details,
          images: dayImageUrls,
        };
      })
    );
    const payload = {
      title: data.title,
      duration: data.duration,
      overview: data.overview,
      images: itineraryImages,
      days: processedDays,
      price: data.price,
      tags: data.tags.map((tag) => ({ name: tag.name })),
      arrival_city: data.arrivalCity,
      departure_city: data.departureCity,
      accommodation: data.accommodation,
      location: data.location,
      discount: data.discount,
      cost_inclusive:
        data.costIncluded?.map((item) => item.item).filter(Boolean) || [],
      cost_exclusive:
        data.costExcluded?.map((item) => item.item).filter(Boolean) || [],
    };

    const response = await baseInstance.post("/itineraries/create", payload);
    if (response.status !== 201) throw new Error("Failed to create itinerary.");

    return response.data;
  };

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      router.push("/itineraries");
    },
    onError: (error: any) => {
      console.error("Create Error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to create itinerary. Please try again."
      );
    },
  });

  // Add explicit error handling for form submission
  const onSubmit = async (data: TsItinerarySchema) => {
    console.log("Form submission triggered with data:", data);
    try {
      createMutation(data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
    alert("Please fix the form errors before submitting");
  };

  // Add a test function to debug
  const testSubmit = () => {
    console.log("Test submit clicked");
    console.log("Current form state:", {
      data: watch(),
      errors,
      isValid,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Itinerary
            </h1>
            <p className="text-lg text-gray-600">Plan the perfect adventure</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="space-y-8"
          >
            {/* Debug section - Remove this in production */}
            {shouldShowDebugInfo && (
              <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">
                  Debug Info (Remove in production)
                </h3>
                <p className="text-sm text-yellow-700">
                  Form Valid: {isValid ? "Yes" : "No"}
                </p>
                <p className="text-sm text-yellow-700">
                  Errors Count: {Object.keys(errors).length}
                </p>
                <button
                  type="button"
                  onClick={testSubmit}
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Test Form State
                </button>
              </section>
            )}

            {/* Basic Information Section */}
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
              </div>
            </section>

            {/* Images */}
            <ItineraryImageUploader />

            {/* Destination & Preferences Section */}
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
                <CustomFormInput
                  title="Location"
                  name="location"
                  placeholder="Kenya"
                />
                <AccommodationDropDown />
              </div>
            </section>

            {/* Tags & Days Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Organization & Planning
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add tags and daily activities
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <TagsInput />
                <ItineraryDaysInput />
              </div>
            </section>

            {/* Cost Information Section */}
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
                <CostIncludedInput />
                <CostExcludedInput />
              </div>
            </section>

            {/* Submit Section */}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Itinerary
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

export default CreatePage;

"use client";

import AccommodationDropDown from "@/components/pages/itinerary/newCreate/AccommodationDropDown";
import DaysInput from "@/components/pages/itinerary/newCreate/DaysInput";
import MapUploader from "@/components/pages/itinerary/newCreate/MapUploader";
import MultipleImageUploader from "@/components/pages/itinerary/newCreate/MultipleImageUploader";
import NewFormInput from "@/components/pages/itinerary/newCreate/NewFormInput";
import TextAreaInput from "@/components/pages/itinerary/newCreate/TextAreaInput";
import { safariTs, safariZodStore } from "@/store/SafariZodStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

const NewCreatePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const method = useForm<safariTs>({
    resolver: zodResolver(safariZodStore),
  });

  const { handleSubmit } = method;

  const createItinerary = async (data: safariTs) => {
    console.log(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createItinerary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      router.push("/itineraries");
    },
    onError: () => {},
  });

  const onSubmit = async (data: safariTs) => {
    mutate(data);
  };

  return (
    <div>
      <FormProvider {...method}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <NewFormInput title="Title" name="title" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <NewFormInput title="Arrival City" name="arrivalCity" />
              <NewFormInput title="Departure City" name="departureCity" />
              <NewFormInput title="Price" name="price" type="number" />
              <NewFormInput title="Discount" name="discount" type="number" />
            </div>

            <TextAreaInput title="Overview" name="overview" />
          </div>
          {/* map */}
          <MapUploader />

          {/* itinerary images */}
          <MultipleImageUploader />

          <NewFormInput title="Location" name="location" />
          <AccommodationDropDown />

          <DaysInput />

          <button>Submit</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewCreatePage;

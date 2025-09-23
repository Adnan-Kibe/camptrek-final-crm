"use client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const DaysInput = () => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });
  const handleAppend = () => {
    append({
      day: fields.length + 1,
      title: "",
      details: "",
      images: [],
      hotel: {
        name: "",
        url: "",
        images: [],
      },
    });
  };
  return (
    <div>
      <div>
        <label className="text-lg font-semibold text-gray-800 mb-4 block">
          Itinerary Days
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Plan your day-by-day activities and add photos to your itinerary
        </p>
      </div>
    </div>
  );
};

export default DaysInput;

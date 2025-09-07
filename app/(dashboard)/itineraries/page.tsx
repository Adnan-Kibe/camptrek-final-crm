"use client";
import ItineraryCard from "@/components/pages/itinerary/main/ItineraryCard";
import SkeletonCard from "@/components/pages/itinerary/main/SkeletonCard";
import { baseInstance } from "@/constants/api";
import { ItineraryProps } from "@/constants/propConstants";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus, Map, Calendar, Users, DollarSign } from "lucide-react";

const ItinerariesPage = () => {
  const router = useRouter();
  const fetchItineraries = async () => {
    const response = await baseInstance.get("/itineraries");
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["itineraries"],
    queryFn: fetchItineraries,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
  });

  const handleCreate = () => {
    router.push("/itineraries/create");
  };

  if (isLoading)
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Safari Itineraries
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your amazing safari experiences and adventures
            </p>
          </div>
        </div>

        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between p-1">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <Map className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Safari Itineraries
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your amazing safari experiences and adventures
            </p>
          </div>
        </div>

        {/* Create Itinerary Button */}
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create New Itinerary
        </button>
      </div>

      {/* Statistics Cards */}
      {data && data.itineraries && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Itineraries
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.itineraries.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Duration
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.itineraries.length > 0
                    ? Math.round(
                        data.itineraries.reduce(
                          (sum: number, it: ItineraryProps) =>
                            sum + it.duration,
                          0
                        ) / data.itineraries.length
                      )
                    : 0}{" "}
                  days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Popular Destinations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.itineraries.length > 0
                    ? new Set(
                        data.itineraries.map(
                          (it: ItineraryProps) => it.location
                        )
                      ).size
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.itineraries && data.itineraries.length > 0 ? (
          data.itineraries.map((itinerary: ItineraryProps) => (
            <ItineraryCard key={itinerary.id} {...itinerary} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Itineraries Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating amazing safari experiences for your customers.
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Your First Itinerary
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItinerariesPage;

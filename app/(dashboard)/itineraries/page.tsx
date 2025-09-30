"use client";

import ItineraryCard from "@/components/pages/itinerary/main/ItineraryCard";
import SkeletonCard from "@/components/pages/itinerary/main/SkeletonCard";
import { baseInstance } from "@/constants/api";
import { ListItineraryProp } from "@/constants/propConstants";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Map, Calendar, Users, Search } from "lucide-react";
import React, { useState } from "react";

const ItinerariesPage = () => {
  const router = useRouter();

  // Local state for filters & pagination
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchItineraries = async () => {
    const response = await baseInstance.get("/itineraries", {
      params: {
        page,
        size: 10,
        name: name || undefined,
        sort_by: sortBy,
        order,
      },
    });
    return response.data;
  };

  const { data, isLoading, error, refetch } = useQuery<ListItineraryProp>({
    queryKey: ["itineraries", page, name, sortBy, order],
    queryFn: fetchItineraries,
    staleTime: 1000 * 60 * 10,
  });

  const handleCreate = () => {
    router.push("/itineraries/create");
  };

  // Pagination helpers
  const totalPages = data?.pages || 1;

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        An error occurred: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between p-1">
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

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create New Itinerary
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg flex-1">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search itineraries..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && refetch()}
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700"
        >
          <option value="title">Sort by Title</option>
          <option value="duration">Sort by Duration</option>
          <option value="price">Sort by Price</option>
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button
          onClick={() => {
            setPage(1);
            refetch();
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-md"
        >
          Apply
        </button>
      </div>


      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.itineraries && data.itineraries.length > 0 ? (
            data.itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} {...itinerary} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Itineraries Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting filters or create a new one.
              </p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Itinerary
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ItinerariesPage;

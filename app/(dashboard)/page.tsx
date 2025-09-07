"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { baseInstance } from "@/constants/api";

import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  Mountain,
} from "lucide-react";

// Types for the API response
interface Booking {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  start_date: string;
  number_of_rooms: number;
  number_of_adults: number;
  number_of_children: number;
  country: string;
  dietary_needs: string;
  dietary_info?: string;
  special_requests?: string;
  occasion_info?: string;
  order_tracking_id: string;
  currency: string;
  total_amount: number;
  payment_method: string;
  confirmation_code?: string;
  payment_message?: string;
  payment_status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  itinerary_id: string;
  itinerary: {
    id: string;
    title: string;
    duration: number;
    price: number;
    location: string;
    arrival_city: string;
    departure_city: string;
  };
  created_at: string;
  updated_at: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
  pages: number;
  current_page: number;
  page_size: number;
}

const HomePage = () => {
  const handleFetch = async () => {
    const response = await baseInstance.get<BookingsResponse>("/bookings/");
    return response.data;
  };

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery<BookingsResponse>({
    queryKey: ["bookings"],
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
  });

  // Calculate business metrics
  const calculateMetrics = () => {
    if (!bookingsData?.bookings) return null;

    const bookings = bookingsData.bookings;
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.total_amount,
      0
    );
    const completedPayments = bookings.filter(
      (b) => b.payment_status === "COMPLETED"
    );
    const pendingPayments = bookings.filter(
      (b) => b.payment_status === "PENDING"
    );
    const failedPayments = bookings.filter(
      (b) => b.payment_status === "FAILED"
    );

    const totalGuests = bookings.reduce(
      (sum, booking) =>
        sum + booking.number_of_adults + booking.number_of_children,
      0
    );

    const averageBookingValue =
      totalBookings > 0 ? totalRevenue / totalBookings : 0;
    const completionRate =
      totalBookings > 0 ? (completedPayments.length / totalBookings) * 100 : 0;

    return {
      totalBookings,
      totalRevenue,
      totalGuests,
      completedPayments: completedPayments.length,
      pendingPayments: pendingPayments.length,
      failedPayments: failedPayments.length,
      averageBookingValue,
      completionRate,
    };
  };

  const metrics = calculateMetrics();

  // Get recent bookings
  const recentBookings = bookingsData?.bookings?.slice(0, 5) || [];

  // Get payment status counts
  const getPaymentStatusCounts = () => {
    if (!bookingsData?.bookings) return {};

    return bookingsData.bookings.reduce((acc, booking) => {
      acc[booking.payment_status] = (acc[booking.payment_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const paymentStatusCounts = getPaymentStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "FAILED":
        return "text-red-600 bg-red-100";
      case "CANCELLED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading business data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
          <Mountain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Business Overview
          </h1>
          <p className="text-gray-600 text-lg">
            Monitor your safari business performance and insights
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.totalBookings || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${metrics?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Guests */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.totalGuests || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.completionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Overview */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Status
          </h3>
          <div className="space-y-4">
            {Object.entries(paymentStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusIcon(status)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status.toLowerCase()}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Completion Rate
              </span>
              <span className="text-lg font-bold text-green-600">
                {metrics?.completionRate?.toFixed(1) || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      {bookingsData?.bookings && bookingsData.bookings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {bookingsData.bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {booking.full_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {booking.itinerary.title}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(booking.start_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.itinerary.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {booking.number_of_adults +
                          booking.number_of_children}{" "}
                        guests
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${booking.total_amount}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        booking.payment_status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : booking.payment_status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!bookingsData?.bookings || bookingsData.bookings.length === 0) && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-600">
            When customers start booking safaris, you'll see their information
            here.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

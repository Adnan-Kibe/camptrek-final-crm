"use client";
import BlogCard from "@/components/pages/blog/main/BlogCard";
import SkeletonBlogCard from "@/components/pages/blog/main/SkeletonBlogCard";
import { baseInstance } from "@/constants/api";
import { BlogList, Blogs } from "@/constants/propConstants";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, FileText, AlertCircle, RefreshCw } from "lucide-react";

const BlogPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const handleFetch = async () => {
    const response = await baseInstance.get(`/blogs/`, {
      params: {
        page,
        size: 10,
        sort_by: sortBy,
        order,
      },
    });
    return response.data;
  };

  const { data, isLoading, error } = useQuery<BlogList>({
    queryKey: ["blogs", page, sortBy, order],
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    retry: 2,
  });

  if (error) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Blogs</h1>
            <p className="text-gray-600 text-lg">
              Manage your safari blog content and articles
            </p>
          </div>
        </div>

        {/* Error State */}
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Failed to Load Blogs
          </h2>
          <p className="text-gray-600 mb-6">
            Something went wrong loading blogs. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.refresh()}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Blogs</h1>
            <p className="text-gray-600 text-lg">
              Manage your safari blog content and articles
            </p>
          </div>
        </div>

        {/* Skeletons */}
        <div className="bg-white rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <SkeletonBlogCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Blogs</h1>
              <p className="text-gray-600 text-lg">
                Manage your safari blog content and articles
              </p>
            </div>
          </div>

          {/* Create Blog Button */}
          <Button
            onClick={() => router.push("/blogs/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            Create Blog
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] bg-white rounded-xl">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={order}
            onValueChange={(value) => {
              setOrder(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] bg-white rounded-xl">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blogs List */}
        {data.blogs && data.blogs.length > 0 ? (
          <div className="bg-white rounded-2xl">
            {data.blogs.map((blog: Blogs) => (
              <div
                key={blog.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <BlogCard {...blog} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Blogs Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating amazing content for your safari adventures.
            </p>
            <Button
              onClick={() => router.push("/blogs/create")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Blog
            </Button>
          </div>
        )}

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
            >
              Previous
            </Button>

            <span className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100">
              Page {data.current_page} of {data.pages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, data.pages))}
              disabled={page === data.pages}
              className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default BlogPage;

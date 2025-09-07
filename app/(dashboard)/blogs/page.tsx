"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { baseInstance } from "@/constants/api";
import { useToast } from "@/components/ui/ToastContainer";
import {
  Plus,
  FileText,
  Calendar,
  User,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import DeleteConfirmationDialog from "@/components/global/DeleteDialog/DeleteConfirmationDialog";

// Blog interface based on the API response
interface Blog {
  id: string;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  author_email: string;
  created_at: string;
}

// Loading skeleton component
const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="flex items-center gap-4">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const BlogsPage = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const handleFetch = async () => {
    try {
      const response = await baseInstance.get("/blogs/");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch blogs");
    }
  };

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const response = await baseInstance.delete(`/blogs/delete/${blogId}`);
      return response.data;
    },
    onSuccess: (data) => {
      showToast({
        type: "success",
        title: "Blog Deleted",
        message: data.message || "Blog deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setDeleteDialogOpen(false);
      setBlogToDelete(null);
    },
    onError: (error: any) => {
      console.error("Delete blog error:", error);
      showToast({
        type: "error",
        title: "Delete Failed",
        message: error.response?.data?.message || "Failed to delete blog",
      });
    },
  });

  const handleDeleteClick = (blog: Blog) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (blogToDelete) {
      deleteBlogMutation.mutate(blogToDelete.id);
    }
  };

  const {
    data: blogs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: handleFetch,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 35,
    retry: 2,
  });

  // Handle retry
  const handleRetry = () => {
    refetch();
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Blog Management
            </h1>
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
            {error.message ||
              "We encountered an error while trying to load the blogs. Please try again."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between p-6">
        {/* Left Section */}
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Blog Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your safari blog content and articles
            </p>
          </div>
        </div>

        {/* Create Blog Button */}
        <Link
          href="/blogs/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create New Blog
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Authors</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs
                  ? new Set(blogs.map((blog: Blog) => blog.author_name)).size
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs
                  ? blogs.filter((blog: Blog) => {
                      const blogDate = new Date(blog.created_at);
                      const now = new Date();
                      return (
                        blogDate.getMonth() === now.getMonth() &&
                        blogDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">All Blogs</h3>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, index) => (
              <BlogSkeleton key={index} />
            ))}
          </div>
        ) : blogs && blogs.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {blogs.map((blog: Blog) => (
              <div
                key={blog.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {blog.image_url ? (
                      <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blogs/update/${blog.id}`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit blog"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(blog)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Blogs Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating amazing content for your safari adventures.
            </p>
            <Link
              href="/blogs/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Your First Blog
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {blogToDelete && (
        <DeleteConfirmationDialog
          title="Delete Blog"
          itemName={blogToDelete.title}
          itemType="Blog"
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={deleteBlogMutation.isPending}
        />
      )}
    </div>
  );
};

export default BlogsPage;

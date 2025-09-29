'use client'

import DeleteConfirmationDialog from '@/components/global/DeleteDialog/DeleteConfirmationDialog'
import { Button } from '@/components/ui/button'
import { baseInstance } from '@/constants/api'
import { Blogs } from '@/constants/propConstants'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'


const BlogCard = ({ id, author, title, image_url, created_at }: Blogs) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDelete = async () => {
    const response = await baseInstance.delete(`/blogs/${id}/delete`)
    return response.data
  }

  const { mutate, isPending } = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setIsDialogOpen(false) // close dialog after successful delete
    },
    onError: (err: any) => alert(`Error when deleting blog: ${err}`)
  })

  return (
    <div className="flex items-center gap-4 border rounded-lg p-3 shadow-sm">
      {/* Blog Image */}
      <img
        src={image_url}
        alt={title}
        className="w-20 h-20 object-cover rounded"
      />

      {/* Blog Info */}
      <div className="flex-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">By {author}</p>
        <p className="text-xs text-gray-400">
          {new Date(created_at).toLocaleDateString()}
        </p>
      </div>

      <Button
        onClick={() => router.push(`/blogs/update/${id}`)}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                  text-white py-2 px-4 font-semibold 
                  transition-all duration-200 flex items-center gap-2 shadow-sm"
      >
        <Pencil className="w-4 h-4" />
        Edit
      </Button>

      {/* Delete Button */}
      <Button
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        <Trash2 />
        Delete
      </Button>

      {/* Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirmDelete={() => mutate()}
        isDeleting={isPending}
        title="Delete Blog"
        itemName={title}
        itemType="Blog"
        description={`Are you sure you want to delete the blog "<strong>${title}</strong>"? This action cannot be undone.`}
      />
    </div>
  )
}

export default BlogCard

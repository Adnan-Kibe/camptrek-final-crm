'use client'

import React from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: () => void
  isDeleting: boolean
  title: string
  itemName: string
  description?: string
  itemType?: string
}

const DeleteConfirmationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirmDelete, 
  isDeleting,
  title,
  itemName,
  description,
  itemType = "item"
}: DeleteConfirmationDialogProps) => {
  const defaultDescription = `Are you sure you want to delete ${itemType === "item" ? "" : "this"} ${itemType.toLowerCase()} <strong>"${itemName}"</strong>? This action cannot be undone and the ${itemType.toLowerCase()} will be permanently removed.`

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {title}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-gray-600 text-left">
            <span dangerouslySetInnerHTML={{ 
              __html: description || defaultDescription 
            }} />
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-row gap-3 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmDelete}
            disabled={isDeleting}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete {itemType}
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
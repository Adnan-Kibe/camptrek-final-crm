import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonBlogCard = () => {
  return (
    <div className="flex items-center gap-4 border rounded-lg p-3 mb-2 shadow-sm">
      {/* Skeleton Image */}
      <Skeleton className="w-20 h-20 rounded" />

      {/* Skeleton Texts */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" /> 
        <Skeleton className="h-3 w-1/2" /> 
        <Skeleton className="h-3 w-1/3" />
      </div>

      {/* Skeleton Button */}
      <Skeleton className="h-9 w-20 rounded" />
    </div>
  )
}

export default SkeletonBlogCard

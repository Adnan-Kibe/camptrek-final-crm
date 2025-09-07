import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'


const SkeletonCard = () => {
  return (
    <div className='group bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden max-w-sm hover:border-gray-300'>
        <Skeleton className='h-40 w-full' />
        <div className='p-4 space-y-3'>
          <div>
            <Skeleton className='h-6 w-3/4' />
            <div className="flex items-center text-gray-500 text-xs mt-1">
              <Skeleton className='h-4 w-1/4' />
              <span className="mx-2">•</span>
              <Skeleton className='h-4 w-1/4' />
            </div>
          </div>
          <Skeleton className='h-4 w-full' />
          <div className='flex items-center justify-between text-xs text-gray-600'>
            <div className="flex items-center gap-1">
              <Skeleton className='h-4 w-1/4' />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className='h-4 w-1/4' />
            </div>
          </div>
          <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
            <div className="flex items-center gap-1">
              <Skeleton className='h-6 w-1/4' />
            </div>
          </div>
        </div>
    </div>
  )
}

export default SkeletonCard
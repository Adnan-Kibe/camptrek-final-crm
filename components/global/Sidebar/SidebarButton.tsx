'use client'

import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

type SidebarButtonProp = {
    children: React.ReactNode
    url?: string
}

const SidebarButton = ({children, url} : SidebarButtonProp) => {
    const router = useRouter()
    const pathname = usePathname()
    
    const handleClick = () => {
        if(url){
            router.push(url)
        } else {
            router.push('/')
        }
    }

    const isActive = url ? pathname === url : pathname === '/'

      return (
    <button
      className={`w-full text-left text-sm font-medium cursor-pointer p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
    }

export default SidebarButton
'use client'
import React from 'react'
import SidebarButton from './SidebarButton'
import { useStaffStore } from '@/store/StaffStore'


const Menu = () => {
  const { role } = useStaffStore()
  
  // Check if user is admin (not staff)
  const isAdmin = role?.toLowerCase() !== 'staff'

  return (
    <section className="mb-8">
      <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2'>
        Main Menu
      </h2>
      <ul className='space-y-2'>
        {isAdmin && <SidebarButton>Business Overview</SidebarButton>}
        <SidebarButton url='/itineraries'>Itineraries</SidebarButton>
        
        {/* Blogs Section */}
        <li>
          <SidebarButton url='/blogs'>Blogs</SidebarButton>
        </li>
      </ul>
    </section>
  )
}

export default Menu
'use client'
import React from 'react'
import SidebarButton from './SidebarButton'
import { Settings as SettingsIcon, User } from 'lucide-react'
import { useStaffStore } from '@/store/StaffStore'

const Settings = () => {
  const { role } = useStaffStore()
  
  // Check if user is staff
  const isStaff = role?.toLowerCase() === 'staff'

  return (
    <section className='mt-8'>
      <h2 className='text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2'>
        {isStaff ? 'Account' : 'System'}
      </h2>
      <ul className='space-y-2'>
        <SidebarButton url='/settings'>
          <div className='flex items-center gap-3'>
            {isStaff ? <User className='w-4 h-4' /> : <SettingsIcon className='w-4 h-4' />}
            <span>{isStaff ? 'My Profile' : 'Settings'}</span>
          </div>
        </SidebarButton>
      </ul>
    </section>
  )
}

export default Settings
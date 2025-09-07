
import Sidebar from '@/components/global/Sidebar/Sidebar'
import React from 'react'

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex flex-row gap-6 h-screen overflow-hidden'>
        <div className='flex-shrink-0 h-full overflow-hidden'>
          <Sidebar />
        </div>
        <div className='flex-grow overflow-y-auto bg-white h-screen rounded-l-3xl p-6 m-1'>
          {children}
        </div>
    </div>
  )
}

export default DashboardLayout
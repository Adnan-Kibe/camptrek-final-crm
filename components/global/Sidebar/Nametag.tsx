'use client'
import { useStaffStore } from '@/store/StaffStore'
import React from 'react'
import { User, Mail, Shield } from 'lucide-react'

const Nametag = () => {
    const {email, name, role} = useStaffStore()
    return (
        <div className='bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100'>
            <div className='flex items-center gap-3 mb-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center'>
                    <User className='w-5 h-5 text-white' />
                </div>
                <div>
                    <h3 className='font-semibold text-gray-900 capitalize'>{name || 'User'}</h3>
                    <p className='text-sm text-gray-600 capitalize'>{role?.toLowerCase() || 'Staff'}</p>
                </div>
            </div>
            
            <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Mail className='w-4 h-4 text-gray-400' />
                    <span className='truncate'>{email || 'No email'}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Shield className='w-4 h-4 text-gray-400' />
                    <span className='capitalize'>{role?.toLowerCase() || 'Staff'} Access</span>
                </div>
            </div>
        </div>
    )
}

export default Nametag
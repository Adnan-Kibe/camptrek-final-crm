'use client'
import { baseInstance } from '@/constants/api'
import { useStaffStore } from '@/store/StaffStore'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'

const LogoutButton = () => {
    const setNull = useStaffStore(state => state.setNull)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    
    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await baseInstance.post("/staff/auth/logout")
            console.log('✅ Logout successful')
        } catch (error) {
            console.error('⚠️ Logout API call failed:', error)
        } finally {
            setNull()
            router.replace("/sign-in")
            setIsLoading(false)
        }
    }
    
    return (
        <button
            className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 text-base'
            onClick={handleLogout}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    <span>Logging Out...</span>
                </>
            ) : (
                <>
                    <LogOut className='w-5 h-5' />
                    <span>Log Out</span>
                </>
            )}
        </button>
    )
}

export default LogoutButton
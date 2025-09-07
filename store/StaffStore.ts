import { create } from 'zustand';
import { persist } from 'zustand/middleware'

type StaffStoreProp = {
    id: string
    email: string
    name: string
    role: string
    setData: (id: string, email: string, name: string, role: string) => void;
    setNull: () => void;
}

export const useStaffStore = create<StaffStoreProp>()(
    persist(
        (set) => ({
            id: '',
            email: '',
            name: '',
            role: '',
            setData: (id: string, email: string, name: string, role: string) => set({ id, email, name, role }),
            setNull: () => set({ 
                id: '', 
                email: '', 
                name: '', 
                role: '' 
            })
        }),
        {
            name: "staff"
        }
    )
)
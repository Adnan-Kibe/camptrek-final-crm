'use client'
import React from 'react'
import { motion } from 'motion/react'

type SubmitButtonProp = {
    text: string
    disabled?: boolean
}

const SubmitButton = ({ text, disabled }: SubmitButtonProp) => {
  return (
    <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className='w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
    type='submit'
    disabled={disabled}
    >
        {text}
    </motion.button>
  )
}

export default SubmitButton
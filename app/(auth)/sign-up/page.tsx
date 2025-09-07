'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod'
import SubmitButton from '@/components/pages/auth/SubmitButton';
import FormInput from '@/components/pages/auth/FormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { SignUpSchema, TsSignUp } from '@/store/authZodStore';
import { baseInstance } from '@/constants/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mountain, UserPlus, ArrowLeft, Users, Globe } from 'lucide-react';

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const methods = useForm<TsSignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })
  const { handleSubmit, setError: setFieldError } = methods

  const router = useRouter()

  const onSubmit = async (data: TsSignUp) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password
      }
      const response = await baseInstance.post("/staff/register-manager", payload)
      router.replace("/sign-in")
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      if (err.response?.status === 422) {
        const validationErrors = err.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((error: any) => {
            if (error.loc?.includes('email')) {
              setFieldError('email', { message: error.msg });
            } else if (error.loc?.includes('password')) {
              setFieldError('password', { message: error.msg });
            } else if (error.loc?.includes('firstName')) {
              setFieldError('firstName', { message: error.msg });
            } else if (error.loc?.includes('lastName')) {
              setFieldError('lastName', { message: error.msg });
            }
          });
        } else {
          setError('Please check your input and try again');
        }
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Left Side - Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-500 to-red-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl mb-8 border border-white/30">
              <Users className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              CAMPTREK
              <br />
              SAFARIS
            </h1>
            <p className="text-xl font-medium text-white/90">AFRICA IS A FEELING</p>
          </motion.div>
          
          {/* Welcome Message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center max-w-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Join Our Safari Team</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Become part of our team and help create unforgettable safari experiences across the beautiful landscapes of Africa.
            </p>
          </motion.div>
          
          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Manage safari itineraries</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Handle customer bookings</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Create amazing experiences</span>
            </div>
          </motion.div>
          
          {/* Decorative Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-12 left-12 right-12"
          >
            <div className="flex justify-between items-center text-white/60 text-sm">
              <span>© 2024 Camptrek Safaris</span>
              <span>www.camptreksafaris.com</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <span className="text-red-600">CAMPTREK</span>
              <br />
              <span className="text-red-600">SAFARIS</span>
            </h1>
            <p className="text-gray-600 font-medium text-sm">AFRICA IS A FEELING</p>
          </motion.div>

          {/* Welcome Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Our Team</h2>
            <p className="text-gray-600 text-lg">Create your manager account to get started</p>
          </motion.div>

          {/* Registration Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Decorative Header */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 h-2"></div>
            
            <div className="p-8">
              {/* Show general error message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </motion.div>
              )}

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <FormInput label='First Name' name='firstName' />
                  <FormInput label='Last Name' name='lastName' />
                  <FormInput label='Email' name='email' type='email' />
                  <FormInput label='Password' name='password' type='password' />
                  <FormInput label='Confirm Password' name='confirmPassword' type='password' />

                  <SubmitButton text={isLoading ? 'Creating Account...' : 'Create Account'} disabled={isLoading} />
                </form>
              </FormProvider>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/sign-in" 
                    className="text-red-600 hover:text-red-700 font-semibold underline-offset-2 hover:underline transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back to Login Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-6"
          >
            <Link 
              href="/sign-in"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
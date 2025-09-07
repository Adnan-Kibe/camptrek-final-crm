'use client'
import { SignInSchema, TsSignIn } from '@/store/authZodStore';
import React, { useState, Suspense } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link';
import { baseInstance } from '@/constants/api';
import { useStaffStore } from '@/store/StaffStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Mountain, Compass } from 'lucide-react';

// Component that uses useSearchParams
const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<TsSignIn>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const { setData } = useStaffStore();
  const { handleSubmit, setError: setFieldError } = methods;
  const router = useRouter();
  const searchParams = useSearchParams();


  const onSubmit = async (data: TsSignIn) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        email: data.email,
        password: data.password
      };

      const response = await baseInstance.post("/staff/auth/login", payload);
      
      // Store staff data in your store
      setData(
        response.data.staff_info.id, 
        response.data.staff_info.email, 
        response.data.staff_info.name, 
        response.data.staff_info.role
      );

      
      // Redirect to intended destination or dashboard home
      router.push('/');
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 422) {
        // Handle validation errors from backend
        const validationErrors = err.response.data?.detail;
        if (Array.isArray(validationErrors)) {
          validationErrors.forEach((error: any) => {
            if (error.loc?.includes('email')) {
              setFieldError('email', { message: error.msg });
            } else if (error.loc?.includes('password')) {
              setFieldError('password', { message: error.msg });
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
        setError(err.response?.data?.detail || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <Mountain className="w-16 h-16 text-white" />
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
            <h2 className="text-2xl font-semibold mb-4">Welcome to Your Safari Adventure</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Sign in to access your dashboard and manage unforgettable safari experiences across Africa.
            </p>
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

      {/* Right Side - Login Form */}
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
              <Mountain className="w-10 h-10 text-white" />
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-lg">Sign in to your account to continue</p>
          </motion.div>

          {/* Login Form Card */}
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
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...methods.register('email')}
                        type="email"
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                    </div>
                    {methods.formState.errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {methods.formState.errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...methods.register('password')}
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {methods.formState.errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-sm text-red-600 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                        {methods.formState.errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </form>
              </FormProvider>

              {/* Registration Link */}
              <div className="mt-6 text-center">
                {/* <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/sign-up" 
                    className="text-red-600 hover:text-red-700 font-semibold underline-offset-2 hover:underline transition-colors"
                  >
                    Register as a Manager
                  </Link>
                </p> */}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
const SignInPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}

export default SignInPage
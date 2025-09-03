"use client"

import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { handleSignUp, resetAuth } from '@/app/features/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router'

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUp() {
  
  let dispatch = useDispatch()
  let navigate = useNavigate()

  const { success } = useSelector(store => store.auth)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const handleSubmit = (credentials) => {
    dispatch(handleSignUp(credentials))
  }

  useEffect(() => {
    if (success?.type === 'sign-up') {
      form.reset({ name: '', email: '', password: '' })

      setTimeout(() => {
        dispatch(resetAuth())
      }, 3000)
    }
  }, [success])

  return (
    <div className="h-svh w-svw overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-11/12 lg:w-full lg:max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-slate-500 text-sm">Sign up to start your interview journey</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Your Name" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-6 rounded-xl text-white font-medium text-lg bg-gradient-to-r from-slate-700 to-slate-500 hover:from-slate-800 hover:to-slate-600 shadow-md"
            >
              Sign Up
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <NavLink to="/sign-in" className="text-slate-700 font-medium hover:underline">
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  )
}

"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from 'react-redux'
import { handleGetQuestion, resetAlert } from "@/app/features/interview/interviewSlice"
import { useLocation, useNavigate } from "react-router"
import { useEffect } from "react"

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
})

export default function InterviewSetup() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  let location = useLocation()

  const { loading, question, interviewAttempts } = useSelector(store => store.interview)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      category: "",
      difficulty: "",
    },
  })

  const handleSubmit = (values) => {
    let existingIAs = interviewAttempts    
    dispatch(handleGetQuestion({existingIAs,...values}))
  }

  const handleBack = () =>{
    navigate('/')
  }

  useEffect(() => {
    if (question && !loading) {
      navigate('/interview-session')

      setTimeout(()=>{
        dispatch(resetAlert())
      }, 3000)
    }
  }, [question, loading])

  return (
    <div className="h-svh w-svw overflow-hidden grid content-center justify-items-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-5 bg-white p-6.5 lg:p-10 shadow-xl rounded-lg w-10/12 lg:w-1/3 text-sm md:text-base"
        >
          {/* Role */}
          <FormField className="w-full"
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={'w-full'}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                      <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                      <SelectItem value="Mobile App Developer">Mobile App Developer</SelectItem>
                      <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                      <SelectItem value="Cloud Engineer">Cloud Engineer</SelectItem>
                      <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Machine Learning Engineer">Machine Learning Engineer</SelectItem>
                      <SelectItem value="Cybersecurity Analyst">Cybersecurity Analyst</SelectItem>
                      <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                      <SelectItem value="Product Manager">Product Manager</SelectItem>
                      <SelectItem value="Project Manager">Project Manager</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                      <SelectItem value="QA / Test Engineer">QA / Test Engineer</SelectItem>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Marketing Specialist">Marketing Specialist</SelectItem>
                      <SelectItem value="Sales Executive">Sales Executive</SelectItem>
                      <SelectItem value="Customer Support Specialist">Customer Support Specialist</SelectItem>
                      <SelectItem value="Finance / Accounting">Finance / Accounting</SelectItem>
                      <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={'w-full'}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Behavioral">Behavioral</SelectItem>
                      <SelectItem value="Situational">Situational</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className={'w-full'}>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-slate-700 to-slate-500 hover:bg-gradient-to-l hover:from-slate-700 hover:to-slate-500"
          >
            Submit
          </Button>
           <Button
            onClick={handleBack}
            className="space-y-0 w-full text-white-800 bg-gradient-to-r from-slate-200 to-slate-300 hover:bg-gradient-to-l hover:from-slate-200 hover:to-slate-300"
          >
            Cancel
          </Button>
        </form>
      </Form>
    </div>
  )
}

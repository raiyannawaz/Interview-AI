import z from "zod"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "../ui/input"
import NoImage from '../../assets/No Image.png'
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { handleUpdateUser, setEditMode } from "@/app/features/user/userSlice"
import { Image } from 'lucide-react'
import { useRef } from "react"

export default function UserProfile() {

  let { user } = useSelector(store => store.user)

  let dispatch = useDispatch()

  const ref = useRef(null)

  const MAX_FILE_SIZE = 2 * 1024 * 1024 
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

  const formSchema = z.object({
    name: z.string().min(5),
    email: z.string().email('Invalid email'),
    image: z.any()
      .refine((val) => !val ? true : val instanceof File, "Please upload an image.")
      .refine((file) => !file ? true : file && file.size <= MAX_FILE_SIZE, {
        message: "Max file size is 2MB.",
      })
      .refine((file) => !file ? true : file && ACCEPTED_TYPES.includes(file.type), {
        message: "Only JPG, PNG, WEBP allowed.",
      })
  })

  const { formState : {errors}, ...form} = useForm({
    resolver: zodResolver(formSchema)
  })

  const handleEditUser = () => {
    dispatch(handleUpdateUser({currentEmail: user.email, ...form.getValues()}))
  }

  const handleEditMode = () => {
    dispatch(setEditMode(false))
  }

  const handleUploadImage = () => {
    ref.current.click()
  }

  return (
    <div className="h-svh w-svw fixed top-0 left-0 z-50 bg-black/50">
      <div className="w-[85%] lg:w-1/3 bg-slate-200 top-[50%] left-[50%] -translate-[50%] rounded-2xl py-7.5 absolute shadow-2xl z-30">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditUser)} className="space-y-5 w-10/12 mx-auto">

            {/* Avatar + Upload */}
            <div className="flex flex-col justify-center items-center mb-2.5 relative">
              <Avatar>
                <AvatarImage
                  className="rounded-[50%] h-28 w-28 lg:h-32 lg:w-32"
                  src={typeof(form.watch('image')) === 'object' ?
                    URL.createObjectURL(form.watch('image')) :
                    user?.user_metadata?.avatar_url ? user.user_metadata.avatar_url : NoImage}
                />
              </Avatar>

              {/* Upload Button */}
              <Button
                type="button"
                onClick={handleUploadImage}
                className={`!rounded-full absolute ${errors.image ? 'translate-y-2.5' : 'translate-y-7.5'} translate-x-7.5 h-10 w-10 text-white font-medium 
                   bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md`}
              >
                <Image />
              </Button>

              {/* Hidden file input */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={ref}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="hidden"
                    />
                    <FormMessage className="text-red-500 mt-5 mb-2.5" />
                  </>
                )}
              />

              <h2 className={`text-sm lg:text-lg font-bold text-slate-700 mt-${errors.image ? '3' : '5'}`}>User Details:</h2>
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              defaultValue={user?.user_metadata?.name || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your Name"
                      className="rounded-xl bg-slate-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              defaultValue={user?.email || ""}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="rounded-xl bg-slate-700 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-between w-full pt-3">
              <Button
                type="submit"
                className="rounded-xl text-white font-medium text-sm lg:text-lg 
                   bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md px-6"
              >
                Save
              </Button>

              <Button
                type="button"
                onClick={handleEditMode}
                className="rounded-xl text-white font-medium text-sm lg:text-lg 
                   bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md px-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

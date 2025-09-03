import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import NoImage from '../assets/No Image.png'
import InterviewAttempt from "../components/custom/InterviewAttempt"
import { setCurrentIA } from '../app/features/interview/interviewSlice'
import { handleSignOut } from "@/app/features/auth/authSlice"
import UserProfile from "@/components/custom/UserProfile"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { resetAlert, setEditMode } from "@/app/features/user/userSlice"
import { useEffect } from "react"

export default function Dashboard() {

  let { user, editMode, success } = useSelector(store => store.user)

  let { currentIA, interviewAttempts } = useSelector(store => store.interview)

  let dispatch = useDispatch()

  let navigate = useNavigate()

  let { name } = user?.user_metadata || {}

  let { created_at, last_sign_in_at, updated_at } = user || {}

  const handleRedirect = () => {
    navigate('/interview-setup')
  }

  const handleCurrentIA = (interviewAttempt) => {
    dispatch(setCurrentIA(interviewAttempt))
  }

  const handleSigningOut = () => {
    dispatch(handleSignOut())

    setTimeout(() => {
      navigate('/sign-in')
    }, 1000)
  }

  const handleEditMode = () =>{
    dispatch(setEditMode(true))
  }

  useEffect(()=>{
    if(success?.type === 'update-user'){
      setTimeout(()=>{
        resetAlert()
      }, 3000)
    }
  }, [success])

  return (
    <div className="h-auto min-h-svh lg:h-svh lg:min-h-auto w-svw flex flex-col lg:flex-row lg:justify-between gap-5 lg:gap-7.5 bg-slate-50 p-5 lg:p-7.5 relative">
      {/* Interview Attempts */}
      {currentIA && <InterviewAttempt handleCurrentIA={handleCurrentIA} />}
      { editMode && <UserProfile/>}
      {/* Interview Attempts */}
      {/* Left  */}
      <div className="lg:w-3/4 bg-slate-200 rounded-2xl">
        <div className="top-content flex justify-between items-center h-[6.5rem] lg:h-1/5 px-5 lg:px-7.5">
          <div className="flex flex-col lg:space-y-1">
            <h2 className="text-lg lg:text-3xl font-bold">Hello {name?.split(' ').length > 0 ? name.split(' ')[1] : name?.split(' ')[0] || ''}</h2>
            <p className="text-xs">List of your interview attempts</p>
          </div>
          <Button
            type="submit" onClick={handleRedirect}
            className="lg:py-10 rounded-xl text-white font-medium lg:text-lg bg-gradient-to-r from-slate-700 to-slate-500 hover:from-slate-800 hover:to-slate-600 shadow-md"
          >Start Interview</Button>
        </div>
        <div className="center-content lg:h-4/5 px-5 lg:px-7.5 pb-5 lg:pb-7.5">
          <div className="max-h-[50vh] lg:max-h-full lg:h-full w-full space-y-3 overflow-y-auto [scrollbar-width:none] rounded-2xl">
            {interviewAttempts.map(interviewAttempt =>
              <div className="flex justify-between items-center bg-slate-400 p-3 rounded-2xl" key={interviewAttempt.id}>
                <h2 className="hidden lg:block text-sm lg:text-base text-white">{interviewAttempt.question.split(' ').slice(0, 12).join(' ')}...</h2>
                <h2 className="block lg:hidden text-xs lg:text-base text-white">{interviewAttempt.question.split(' ').slice(0, 10).join(' ')}</h2>
                <Button
                  type="submit" onClick={() => handleCurrentIA(interviewAttempt)}
                  className="rounded-xl ms-auto text-white font-medium text-sm lg:text-lg bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md"
                >View </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Left  */}
      {/* Right */}
      <div className="lg:w-1/4 bg-slate-200 rounded-2xl pt-5 relative">
        <div className="user-profile flex flex-col justify-center mx-auto h-full w-10/12 pb-14 lg:pb-7">
        <Avatar className="mb-7.5">
          <AvatarImage className="rounded-[50%] mx-auto h-28 w-28 lg:h-32 lg:w-32" src={user?.user_metadata?.avatar_url || NoImage}/>
        </Avatar>
          <h2 className="text-sm lg:text-base mb-5 text-left"><span className="font-bold">User Details:</span></h2>
          <p className="text-sm lg:text-base mb-5"><span className="font-bold">Name:</span> {name}</p>
          <p className="text-sm lg:text-base mb-5"><span className="font-bold">Email:</span> {user?.email}</p>
          <p className="text-sm lg:text-base mb-5"><span className="font-bold">User created:</span> {new Date(created_at).toLocaleString()}</p>
          <p className="text-sm lg:text-base mb-5"><span className="font-bold">Last Sign In:</span> {new Date(last_sign_in_at).toLocaleString()}</p>
          <p className="text-sm lg:text-base mb-5"><span className="font-bold">Last Updated:</span> {new Date(updated_at).toLocaleString()}</p>
        </div>
        <div className="absolute bottom-5 flex justify-between w-full px-7">
          <Button
            type="submit" onClick={handleEditMode}
            className="rounded-xl text-white font-medium text-sm lg:text-lg bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md"
          >Edit Profile</Button>
          <Button
            type="submit" onClick={handleSigningOut}
            className="rounded-xl text-white font-medium text-sm lg:text-lg bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-800 hover:to-slate-600 shadow-md"
          >Sign Out</Button>
        </div>
      </div>
      {/* Right */}
    </div>
  )
}
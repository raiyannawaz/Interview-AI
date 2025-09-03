import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router'
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ProtectedRoute from './components/custom/ProtectedRoute'
import InterviewSetup from './pages/interviewSetup'
import React, { useEffect } from 'react'
import { handleGetSession, handleGetUser } from './app/features/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import Alert from './components/custom/Alert'
import InterviewSession from './pages/InterviewSession'
import Spinner from './components/custom/Spinner'
import InterviewFeedback from './pages/InterviewFeedback'
import { getInterviewAttempts, resetAlert } from './app/features/interview/interviewSlice'
import AuthCallback from './components/custom/AuthCallback'

function App() {

  let dispatch = useDispatch()

  let { token, user } = useSelector(store => store.user)

  let { success } = useSelector(store => store.interview)

  useEffect(()=>{
    localStorage.setItem(JSON.stringify({href: window.location.href, hash: window.location.hash}))
  }, [])

  useEffect(() => {
    dispatch(handleGetSession())
    if (token) {
      dispatch(handleGetUser())
    }

    if (user?.id) {
      dispatch(getInterviewAttempts(user.id))
    }

  }, [token, user?.id])
  
  useEffect(()=>{
    if(success?.type === 'get-interview-attempts'){
      setTimeout(()=>{
        dispatch(resetAlert())
      }, 3000)
    }
  }, [success])

  return (
    <Router>
      <Alert />
      <Spinner />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        {/* This is for supabase email confirm redirect */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* This is for supabase email confirm redirect */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path='/interview-setup' element={<InterviewSetup />} />
          <Route path='/interview-session' element={<InterviewSession />} />
          <Route path='/interview-feedback' element={<InterviewFeedback />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

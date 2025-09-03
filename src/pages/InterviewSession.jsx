"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { handleSubmitAnswer, resetAlert, resetFeedback } from "@/app/features/interview/interviewSlice"

export default function InterviewSession() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 min timer
  const [answer, setAnswer] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { question, loading, feedback, setup } = useSelector(store => store.interview)

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSubmit = () => {
    if (!answer.trim()) return
    dispatch(handleSubmitAnswer({ question, answer, setup }))
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  const handleBack = () =>{
    navigate('/')

    setTimeout(()=>{
      dispatch(resetFeedback())
    }, 1000)
  }

  useEffect(() => {
    if (feedback) {
      navigate('/interview-feedback')
      
      setTimeout(()=>{
        dispatch(resetAlert())
      }, 3000)
    }
  }, [feedback])

  useEffect(() => {
    if (loading || !question) {
      navigate('/interview-setup')
    }
  }, [question, loading])

  return (
    <div className="h-svh w-svw overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-2 lg:p-6">
      <Card className="w-11/12 lg:w-full lg:max-w-2xl shadow-xl rounded-2xl text-sm md:text-base">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Interview Question</CardTitle>
          <p className="text-slate-500 mt-2">
            You have <span className="font-medium">{formatTime(timeLeft)}</span> to answer
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question */}
          <div className="p-4 rounded-lg bg-slate-50 border text-slate-700 max-h-40 overflow-auto scrollbar-hide">
            {question}
          </div>

          {/* Answer box */}
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="h-40 resize-none overflow-y-auto"
          />

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-500 hover:from-slate-800 hover:to-slate-600"
          >
            Submit Answer
          </Button>
          <Button
            onClick={handleBack}
            className="space-y-0 w-full text-white-800 bg-gradient-to-r from-slate-200 to-slate-300 hover:bg-gradient-to-l hover:from-slate-200 hover:to-slate-300"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

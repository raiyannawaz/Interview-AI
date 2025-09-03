"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { getInterviewAttempts, resetFeedback } from "@/app/features/interview/interviewSlice"

export default function Feedback() {
  let { feedback } = useSelector(store => store.interview)
  let { user } = useSelector(store => store.user)

  let navigate = useNavigate()
  let dispatch = useDispatch()

  const handleBack = () => {
    dispatch(resetFeedback())
    if(user?.id){
      dispatch(getInterviewAttempts(user.id))
    }
  }

  useEffect(() => {
    if (!feedback) {
      navigate('/')
    }
  }, [feedback])

  return (
    <div className="h-[100dvh] w-svw flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl flex flex-col max-h-[90vh]">
        
        {/* Header (fixed, not scrollable) */}
        <CardHeader className="text-center shrink-0">
          <CardTitle className="text-xl font-semibold">AI Interview Feedback</CardTitle>
          <p className="text-slate-500 mt-2">
            Here’s your evaluation based on the submitted answer
          </p>
        </CardHeader>

        {/* Content (scrollable only if needed) */}
        <CardContent className="flex-1 overflow-y-auto space-y-6 p-6">
          {/* Score */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-slate-600 font-medium">Score:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {feedback?.score}
            </Badge>
          </div>

          {/* Strengths */}
          {feedback?.strengths && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
              <p className="text-slate-700">{feedback.strengths}</p>
            </div>
          )}

          {/* Weaknesses */}
          {feedback?.weaknesses && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
              <p className="text-slate-700">{feedback.weaknesses}</p>
            </div>
          )}

          {/* Suggestions */}
          {feedback?.suggestions && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-700 mb-2">Suggestions</h4>
              <p className="text-slate-700 leading-relaxed">{feedback.suggestions}</p>
            </div>
          )}
        </CardContent>

        {/* Footer (fixed, not scrollable) */}
        <div className="p-4 border-t bg-white/50 backdrop-blur-sm shrink-0 rounded-b-2xl">
          <Button
            type="button"
            onClick={handleBack}
            className="w-auto h-10 ms-auto block bg-gradient-to-r from-slate-700 to-slate-500 hover:bg-gradient-to-l hover:from-slate-700 hover:to-slate-500"
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}

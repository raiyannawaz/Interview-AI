import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"

export default function InterviewAttempt({ handleCurrentIA }) {

  let { currentIA } = useSelector(store=>store.interview)

  let { strengths, suggestions, weaknesses } = JSON.parse(currentIA.feedback)

  let { role, category, difficulty } = JSON.parse(currentIA.setup)

  const handleResetCurrentIA = () =>{
    handleCurrentIA(null)
  }

  return (
      <Card className="w-10/12 lg:w-auto h-[90%] fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] flex flex-col shadow-xl rounded-2xl z-30">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">
            AI Interview Feedback
          </CardTitle>
          <p className="text-slate-500 mt-2">
            Evaluation for your submitted answer
          </p>
        </CardHeader>

        {/* Content (scrollable if long) */}
        <CardContent className="flex-1 overflow-y-auto px-6 space-y-6">

          {/* Setup  */}
          <div className="px-4 bg-slate-50 py-4 rounded-2xl">
            <p className="flex flex-col lg:flex-row space-y-2.5 lg:space-y-0 lg:space-x-7.5 w-full text-sm lg:text-base">
              <span>Role: {role}</span> 
              <span>Category: {category}</span> 
              <span>Difficulty: {difficulty}</span>
            </p>
          </div>
          {/* Setup  */}

          {/* Question */}
          <div className="p-4 bg-slate-400 rounded-2xl">
            <h3 className="font-extrabold text-white mb-2 text-sm lg:text-base">Question:</h3>
            <p className="text-white leading-relaxed text-sm lg:text-base">{currentIA.question}</p>
          </div>

          {/* Answer */}
          <div className="p-4 bg-slate-400 rounded-2xl">
            <h3 className="font-extrabold text-white mb-2 text-sm lg:text-base">Your Answer:</h3>
            <p className="whitespace-pre-line text-white leading-relaxed text-sm lg:text-base">
              {currentIA.answer}
            </p>
          </div>

          {/* Strengths */}
          {strengths && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
              <h4 className="font-semibold text-green-700 mb-2 text-sm lg:text-base">Strengths:</h4>
              <p className="text-slate-700 text-sm lg:text-base">{strengths}</p>
            </div>
          )}

          {/* Weaknesses */}
          {weaknesses && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <h4 className="font-semibold text-red-700 mb-2 text-sm lg:text-base">Weaknesses:</h4>
              <p className="text-slate-700 text-sm lg:text-base">{weaknesses}</p>
            </div>
          )}

          {/* Suggestions */}
          {suggestions && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <h4 className="font-semibold text-blue-700 mb-2 text-sm lg:text-base">Suggestions:</h4>
              <p className="text-slate-700 leading-relaxed text-sm lg:text-base">
                {suggestions}
              </p>
            </div>
          )}
          
          {/* Score */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-slate-600 font-medium text-sm lg:text-base">Score:</span>
            <Badge variant="secondary" className="px-3 py-1 text-sm lg:text-base">
              {currentIA.score}
            </Badge>
          </div>
        </CardContent>

        {/* Footer with Back Button */}
        <div className="flex justify-end px-6 py-4 border-t">
          <Button
            type="button"
            onClick={handleResetCurrentIA}
            className="bg-gradient-to-r from-slate-700 to-slate-500 hover:bg-gradient-to-l hover:from-slate-700 hover:to-slate-500"
          >
            Back
          </Button>
        </div>
      </Card>
  )
}

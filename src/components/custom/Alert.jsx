import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { useSelector } from "react-redux"

export default function AlertDemo() {

    let { error: userError, success: userSuccess } = useSelector(store => store.user)
    let { error: interviewError, success: interviewSuccess } = useSelector(store => store.interview)
    let { error: authError, success: authSuccess } = useSelector(store => store.auth)

    return (
        <div className="grid w-full max-w-xs items-start gap-4 fixed right-10 top-10 z-50">
            { authSuccess || userSuccess || interviewSuccess ? <Alert>
                <CheckCircle2Icon />
                <AlertTitle>{authSuccess?.message || userSuccess?.message || interviewSuccess?.message}</AlertTitle>
            </Alert> : ''}
            { authError || userError || interviewError ? <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>{authError?.message || userError?.message || interviewError?.message}</AlertTitle>
            </Alert> : ''}
        </div>
    )
}
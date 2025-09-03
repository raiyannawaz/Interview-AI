import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux"

export default function Spinner() {

  let { loading: authLoading } = useSelector(store=>store.auth)
  let { loading: userLoading } = useSelector(store=>store.user)
  let { loading: interviewLoading } = useSelector(store=>store.interview)

  return (
    authLoading || userLoading || interviewLoading ? <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Loader2 className="h-20 w-20 animate-spin text-primary"/>
    </div> : null
  )
}
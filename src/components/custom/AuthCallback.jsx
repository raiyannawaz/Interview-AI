import { useEffect } from "react"
import { useNavigate } from "react-router"
import { supabase } from "../../supabaseClient"

export default function AuthCallback() {
  const navigate = useNavigate()

  function parseTokensFromUrl() {
    const url = window.location.href
    const [_, maybeRoute, maybeTokens] = url.split("#")

    // Case 1: localhost → tokens directly after #
    if (maybeRoute && maybeRoute.startsWith("access_token")) {
      return new URLSearchParams(maybeRoute)
    }

    // Case 2: GitHub Pages → tokens after 2nd #
    if (maybeTokens && maybeTokens.startsWith("access_token")) {
      return new URLSearchParams(maybeTokens)
    }

    return null
  }

  useEffect(() => {
    const params = parseTokensFromUrl()
    if (!params) {
      console.error("No tokens in URL")
      navigate("/sign-in")
      return
    }

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            console.error("Error setting session:", error.message)
            navigate("/sign-in")
          } else {
            // cleanup URL → go to home
            window.history.replaceState({}, document.title, "/Interview-AI/#/")
            navigate("/")
          }
        })
    } else {
      console.error("Tokens missing in params")
      navigate("/sign-in")
    }
  }, [navigate])

  return (
    <div className="h-svh w-svw bg-slate-50 flex justify-center items-center">
      <p>Completing authentication.....</p>
    </div>
  )
}

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const access_token = params.get("access_token")
    const refresh_token = params.get("refresh_token")

    if (access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      }).then(({ data, error }) => {
        if (error) {
          console.error("Error setting session:", error.message)
        } else {
          console.log("Session established:", data)
          window.history.replaceState({}, document.title, "/Interview-AI/#/")
          navigate("/")
        }
      })
    } else {
      console.error("No tokens in URL")
      navigate("/sign-in")
    }
  }, [navigate])

  return <div className="h-svh w-svw bg-slate-50 flex justify-center items-center"><p>Completing authentication...</p></div>;
}

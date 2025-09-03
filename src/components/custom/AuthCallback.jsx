import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      // Supabase helper will read the hash (#access_token=...) and set the session
      const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error("Auth error:", error.message)
        return
      }
      navigate("/")
    }

    handleSession()
  }, [navigate]);

  return <div className="h-svh w-svw bg-slate-50 flex justify-center items-center"><p>Completing sign in...</p></div>;
}

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const process = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Session error:", error)
        return
      }
      navigate("/")
    }
    process()
  }, [navigate]);

  return <div className="h-svh w-svw bg-slate-50 flex justify-center items-center"><p>Completing sign in...</p></div>;
}

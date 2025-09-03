import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/dashboard"); // or /sign-in
      }
    });
  }, [navigate]);

  return <div className="h-svh w-svw bg-slate-50 flex justify-center items-center"><p>Completing sign in...</p></div>;
}

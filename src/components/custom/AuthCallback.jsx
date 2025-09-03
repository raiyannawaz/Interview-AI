import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth callback error:', error);
        navigate('/login'); 
        return;
      }

      if (data.session) {
        navigate('/');
      } else {
        navigate('/sign-in'); // or your auth page
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return <div className="h-svh w-svw bg-slate-50 flex justify-center items-center"><p>Completing authentication...</p></div>;
}

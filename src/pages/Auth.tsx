
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthLayout";
import { LoginForm } from "@/components/LoginForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Auth = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
      setInitialLoading(false);
    };
    
    checkUser();
  }, [navigate]);

  if (initialLoading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Auth;

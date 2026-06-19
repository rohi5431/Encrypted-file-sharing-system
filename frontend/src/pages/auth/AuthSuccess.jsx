import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Loader as Loader2 } from "lucide-react";

import { ThemeProvider } from "@/components/layout/ThemeProvider";

function AuthSuccessPage() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const token = new URLSearchParams(search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } else {
      setTimeout(() => navigate("/login", { replace: true }), 1000);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Shield className="h-7 w-7 text-accent-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            SecureShare
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Signing you in...</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthSuccessPageWrapper() {
  return (
    <ThemeProvider>
      <AuthSuccessPage />
    </ThemeProvider>
  );
}

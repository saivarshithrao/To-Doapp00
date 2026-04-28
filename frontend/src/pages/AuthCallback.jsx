import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export default function AuthCallback() {
  const { googleSession } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    const hash = window.location.hash || "";
    const params = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
    const session_id = params.get("session_id");
    if (!session_id) {
      toast.error("No session returned from Google");
      nav("/login");
      return;
    }
    googleSession(session_id)
      .then(() => {
        toast.success("Signed in with Google");
        nav("/dashboard");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.detail || "Google sign-in failed");
        nav("/login");
      });
  }, [googleSession, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Finalizing sign in...</span>
      </div>
    </div>
  );
}

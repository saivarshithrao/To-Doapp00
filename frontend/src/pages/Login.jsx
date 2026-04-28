import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.requires_mfa) {
        toast.success("Verification code sent to your email");
        nav(`/mfa?token=${encodeURIComponent(res.mfa_token)}&email=${encodeURIComponent(email)}`);
      } else {
        toast.success("Welcome back");
        nav("/dashboard");
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="hidden md:flex relative items-center justify-center p-12 border-r border-border bg-secondary/40 grid-bg">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-md bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Vault<span className="text-primary">Do</span></span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Sign in to continue.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your tasks are AES-256 encrypted. Multi-factor authentication keeps your account safe.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6" data-testid="login-form">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access your vault.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password-input" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full" data-testid="login-submit-btn">
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Google sign-in can be enabled during backend deployment if configured.
          </p>

          <p className="text-sm text-center text-muted-foreground">
            New here? <Link to="/signup" className="text-primary font-medium hover:underline" data-testid="goto-signup-link">Create an account</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground font-mono">
            Demo: demo@todoapp.com / Demo@1234
          </p>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form.email, form.password, form.name);
      toast.success("Account created. Welcome!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Signup failed");
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
          <h2 className="text-3xl font-bold tracking-tight mb-4">Create your encrypted vault.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Setup takes under 30 seconds. Your tasks are encrypted before they touch our database.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6" data-testid="signup-form">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1">Get started in seconds. No credit card.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="signup-name-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="signup-email-input" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="signup-password-input" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full" data-testid="signup-submit-btn">
            {loading ? "Creating..." : "Create account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have one? <Link to="/login" className="text-primary font-medium hover:underline" data-testid="goto-login-link">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

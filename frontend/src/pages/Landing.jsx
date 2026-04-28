import React from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import { ShieldCheck, Lock, KeyRound, Zap, ArrowRight } from "lucide-react";

const features = [
  { icon: Lock, title: "AES-256 Encryption", desc: "Every task is encrypted at rest. Only you can read what you wrote." },
  { icon: KeyRound, title: "MFA by Email OTP", desc: "Two-factor auth with time-limited codes delivered to your inbox." },
  { icon: ShieldCheck, title: "JWT + OAuth", desc: "Stateless sessions and Google sign-in, with brute-force protection." },
  { icon: Zap, title: "Keyboard-fast UI", desc: "Minimal, high-contrast, no distractions. Built for daily operators." },
];

export default function Landing() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Vault<span className="text-primary">Do</span></span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost" size="sm" data-testid="nav-login-btn">Sign in</Button></Link>
            <Link to="/signup"><Button size="sm" className="rounded-full" data-testid="nav-signup-btn">Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Encrypted · MFA · Modern
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground leading-[1.05]">
              Your tasks, <br />
              <span className="text-primary">encrypted by default.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              A minimal, high-contrast to-do app for people who care about privacy and speed.
              AES-256 encryption, multi-factor authentication, and a dashboard that stays out of your way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg" className="rounded-full gap-2" data-testid="hero-cta-btn">
                  Start free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="rounded-full" data-testid="hero-signin-btn">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-border">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="border border-border rounded-lg p-6 md:p-8 bg-card hover:border-primary/20 hover:-translate-y-1 hover:shadow-lg transition-all"
              data-testid={`feature-card-${i}`}
            >
              <f.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-semibold text-xl text-foreground mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 VaultDo</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

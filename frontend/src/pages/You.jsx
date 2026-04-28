import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, Lock, Mail, User as UserIcon, LogOut, Moon, Sun, KeyRound } from "lucide-react";

function Inner() {
  const { user, toggleMfa, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  const handleMfa = async (val) => {
    try { await toggleMfa(val); toast.success(val ? "MFA enabled" : "MFA disabled"); }
    catch { toast.error("Failed to update MFA"); }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto" data-testid="you-page">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Account</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mt-1">You</h1>
      </div>

      <div className="flex items-center gap-4 border border-border rounded-lg bg-card p-6 mb-4">
        <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Row icon={ShieldCheck} title="Multi-Factor Authentication">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground max-w-md">
              Send a 6-digit one-time code to your email on every sign-in. Highly recommended.
            </p>
            <Switch checked={user.mfa_enabled} onCheckedChange={handleMfa} data-testid="mfa-toggle" />
          </div>
        </Row>

        <Row icon={theme === "dark" ? Moon : Sun} title="Appearance">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Current theme: <span className="text-foreground font-medium capitalize">{theme}</span></p>
            <Button variant="outline" size="sm" onClick={toggle} data-testid="you-theme-toggle">Toggle</Button>
          </div>
        </Row>

        <Row icon={Lock} title="Data encryption">
          <p className="text-sm text-muted-foreground">
            Task titles and descriptions are encrypted at rest using <span className="font-mono text-foreground">AES-256-GCM</span>.
            Each record uses a random 96-bit nonce. Only our backend with the key can decrypt values.
          </p>
        </Row>

        <Row icon={KeyRound} title="Authentication">
          <p className="text-sm text-muted-foreground">
            We use short-lived <span className="font-mono text-foreground">JWT</span> tokens (60 min). Passwords are hashed with bcrypt.
            Google OAuth can be enabled if your backend is configured for it.
          </p>
        </Row>

        <Row icon={Mail} title="OTP delivery">
          <p className="text-sm text-muted-foreground">
            Codes are sent via email. In development mode they are also logged to the backend server console.
            Configure SMTP variables in <span className="font-mono">backend/.env</span> to send real emails.
          </p>
        </Row>

        <div className="pt-2">
          <Button variant="outline" onClick={() => { logout(); nav("/login"); }} className="gap-2" data-testid="you-logout">
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, title, children }) {
  return (
    <div className="border border-border rounded-lg bg-card p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function You() {
  return (<AppLayout><Inner /></AppLayout>);
}

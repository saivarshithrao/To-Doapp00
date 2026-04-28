import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { Switch } from "../components/ui/switch";
import { toast } from "sonner";
import { ShieldCheck, Lock, Mail, User as UserIcon } from "lucide-react";

export default function Settings() {
  const { user, toggleMfa } = useAuth();
  const handleMfa = async (val) => {
    try {
      await toggleMfa(val);
      toast.success(val ? "MFA enabled" : "MFA disabled");
    } catch {
      toast.error("Failed to update MFA");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-10" data-testid="settings-main">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Account</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mt-1">Settings</h1>
        </div>

        <div className="space-y-4">
          <Row icon={UserIcon} title="Profile">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
          </Row>

          <Row icon={ShieldCheck} title="Multi-Factor Authentication">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground max-w-md">
                  Send a 6-digit one-time code to your email on every sign-in. Highly recommended.
                </p>
              </div>
              <Switch
                checked={user.mfa_enabled}
                onCheckedChange={handleMfa}
                data-testid="mfa-toggle"
              />
            </div>
          </Row>

          <Row icon={Lock} title="Data encryption">
            <p className="text-sm text-muted-foreground">
              Tasks and descriptions are encrypted at rest using <span className="font-mono text-foreground">AES-256-GCM</span>.
              Only our backend with the key can decrypt the values.
            </p>
          </Row>

          <Row icon={Mail} title="OTP Delivery">
            <p className="text-sm text-muted-foreground">
              Codes are sent via email. In development, they are also logged to the backend server console.
            </p>
          </Row>
        </div>
      </main>
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

import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import { toast } from "sonner";
import { api } from "../lib/api";
import { KeyRound } from "lucide-react";

export default function MFAVerify() {
  const { verifyMfa } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const mfa_token = sp.get("token") || "";
  const email = sp.get("email") || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await verifyMfa(mfa_token, otp);
      toast.success("Verified");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      await api.post(`/auth/mfa/resend?mfa_token=${encodeURIComponent(mfa_token)}`);
      toast.success("New code sent");
    } catch {
      toast.error("Could not resend");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-6 border border-border rounded-lg bg-card p-8" data-testid="mfa-form">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
          <KeyRound className="h-5 w-5" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Two-factor verification</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} data-testid="mfa-otp-input">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" disabled={loading || otp.length !== 6} className="w-full" data-testid="mfa-submit-btn">
          {loading ? "Verifying..." : "Verify"}
        </Button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={resend} className="text-primary hover:underline" data-testid="mfa-resend-btn">Resend code</button>
          <button type="button" onClick={() => nav("/login")} className="text-muted-foreground hover:underline" data-testid="mfa-back-btn">Back to login</button>
        </div>
      </form>
    </div>
  );
}

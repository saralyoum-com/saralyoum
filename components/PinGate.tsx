"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";

/** Shared PIN-entry gate for internal admin pages. Session cookie is set by
 * /api/auth/pin (see lib/connectAuth.ts) and shared across all gated pages. */
export default function PinGate({
  icon,
  title,
  subtitle,
  checkAuth,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  checkAuth: () => Promise<boolean>;
  children: ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(false);

  const probe = useCallback(async () => {
    const ok = await checkAuth();
    setUnlocked(ok);
    setChecked(true);
  }, [checkAuth]);

  useEffect(() => {
    probe();
  }, [probe]);

  const submitPin = async () => {
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setUnlocked(true);
        setPinError("");
      } else if (res.status === 429) {
        setPinError("محاولات كثيرة — انتظر قليلاً");
      } else {
        setPinError("PIN غير صحيح");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#080808", fontFamily: "Tajawal,sans-serif" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 20, padding: "48px 44px", textAlign: "center", width: 340 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#C9A84C", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 14, color: "#555", marginBottom: 32 }}>{subtitle}</div>
          <input
            type="password"
            placeholder="أدخل الـ PIN"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            onKeyDown={(e) => e.key === "Enter" && submitPin()}
            style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 18, textAlign: "center", outline: "none", marginBottom: 12, letterSpacing: 4 }}
          />
          {pinError && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{pinError}</div>}
          <button
            onClick={submitPin}
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", border: "none", borderRadius: 12, color: "#000", fontWeight: 700, fontSize: 16, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "..." : "دخول"}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

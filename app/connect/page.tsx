"use client";
import { useState, useEffect, useCallback } from "react";

const PLATFORMS = [
  {
    id: "facebook",
    name: "Facebook",
    nameAr: "فيسبوك",
    icon: "📘",
    desc: "صفحة SARD — سعر الذهب",
    authUrl: "/api/auth/facebook",
    active: true,
  },
  {
    id: "instagram",
    name: "Instagram",
    nameAr: "إنستغرام",
    icon: "📸",
    desc: "حساب SARD — يُربط عبر Facebook OAuth",
    authUrl: "/api/auth/facebook",
    active: true,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    nameAr: "لينكدإن",
    icon: "💼",
    desc: "في انتظار موافقة Microsoft API",
    authUrl: "/api/auth/linkedin",
    active: false,
    note: "⏳ في انتظار الموافقة",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    nameAr: "إكس / تويتر",
    icon: "𝕏",
    desc: "في انتظار إنشاء حساب SARD",
    authUrl: "/api/auth/twitter",
    active: false,
    note: "⏳ في انتظار الحساب",
  },
  {
    id: "telegram",
    name: "Telegram",
    nameAr: "تيليجرام",
    icon: "✈️",
    desc: "قناة SARD — يعمل تلقائياً",
    authUrl: null,
    active: false,
    alwaysConnected: true,
  },
];

export default function ConnectPage() {
  const [pin, setPin]         = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState("");
  const [statuses, setStatuses] = useState<Record<string, { connected: boolean; updated_at?: string }>>({});
  const [flash, setFlash]     = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/status");
      if (res.ok) setStatuses(await res.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("success")) {
      const name = PLATFORMS.find(pl => pl.id === p.get("success"))?.nameAr ?? p.get("success");
      setFlash({ type: "ok", msg: `✅ ${name} تم الربط بنجاح — التوكن محفوظ للأبد` });
      window.history.replaceState({}, "", "/connect");
    }
    if (p.get("error")) {
      setFlash({ type: "err", msg: `❌ خطأ: ${p.get("error")}` });
      window.history.replaceState({}, "", "/connect");
    }
  }, []);

  const checkPin = async () => {
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/pin?pin=${encodeURIComponent(pin)}`);
      if (res.ok) {
        setUnlocked(true);
        setPinError("");
        loadStatuses();
      } else {
        setPinError("PIN غير صحيح");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#080808",fontFamily:"Tajawal,sans-serif" }}>
        <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:20,padding:"48px 44px",textAlign:"center",width:340 }}>
          <div style={{ fontSize:44,marginBottom:12 }}>🔐</div>
          <div style={{ fontSize:24,fontWeight:900,color:"#C9A84C",marginBottom:6 }}>SARD Connect</div>
          <div style={{ fontSize:14,color:"#555",marginBottom:32 }}>لوحة تحكم المنصات الاجتماعية</div>
          <input
            type="password"
            placeholder="أدخل الـ PIN"
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(""); }}
            onKeyDown={e => e.key === "Enter" && checkPin()}
            style={{ width:"100%",padding:"14px 18px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,color:"#fff",fontSize:18,textAlign:"center",outline:"none",marginBottom:12,letterSpacing:4 }}
          />
          {pinError && <div style={{ color:"#f87171",fontSize:13,marginBottom:12 }}>{pinError}</div>}
          <button
            onClick={checkPin}
            disabled={loading}
            style={{ width:"100%",padding:"14px",background:"linear-gradient(135deg,#C9A84C,#8B6914)",border:"none",borderRadius:12,color:"#000",fontWeight:700,fontSize:16,cursor:"pointer",opacity:loading?0.6:1 }}
          >
            {loading ? "..." : "دخول"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh",background:"#080808",padding:"48px 20px",fontFamily:"Tajawal,sans-serif",direction:"rtl" }}>
      <div style={{ maxWidth:600,margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:40 }}>
          <div style={{ fontSize:36,marginBottom:10 }}>🔗</div>
          <div style={{ fontSize:28,fontWeight:900,color:"#C9A84C" }}>SARD Social Connect</div>
          <div style={{ fontSize:14,color:"#555",marginTop:6 }}>ربط منصات النشر التلقائي — مرة واحدة للأبد</div>
        </div>

        {/* Flash message */}
        {flash && (
          <div style={{ background:flash.type==="ok"?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:`1px solid ${flash.type==="ok"?"rgba(34,197,94,0.3)":"rgba(239,68,68,0.3)"}`,borderRadius:12,padding:"14px 20px",marginBottom:24,color:flash.type==="ok"?"#4ade80":"#f87171",fontSize:14,textAlign:"center" }}>
            {flash.msg}
          </div>
        )}

        {/* Platform cards */}
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {PLATFORMS.map(p => {
            const st = statuses[p.id];
            const connected = p.alwaysConnected || st?.connected;
            return (
              <div key={p.id} style={{ background:"rgba(255,255,255,0.03)",border:`1px solid ${connected?"rgba(34,197,94,0.25)":"rgba(255,255,255,0.07)"}`,borderRadius:16,padding:"20px 22px",display:"flex",alignItems:"center",gap:16 }}>
                <div style={{ fontSize:30,width:44,textAlign:"center",flexShrink:0 }}>{p.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:17,fontWeight:700,color:"#fff" }}>{p.nameAr}</div>
                  <div style={{ fontSize:12,color:"#555",marginTop:3 }}>{p.desc}</div>
                  {st?.updated_at && (
                    <div style={{ fontSize:11,color:"#3a3a3a",marginTop:2 }}>
                      آخر تحديث: {new Date(st.updated_at).toLocaleDateString("ar")}
                    </div>
                  )}
                </div>
                <div style={{ flexShrink:0 }}>
                  {connected ? (
                    <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"center" }}>
                      <div style={{ background:"rgba(34,197,94,0.12)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:20,padding:"6px 18px",color:"#4ade80",fontSize:13,fontWeight:600,whiteSpace:"nowrap" }}>
                        ✅ متصل
                      </div>
                      {p.authUrl && p.active && (
                        <a href={p.authUrl} style={{ fontSize:11,color:"#444",textDecoration:"none" }}>تحديث</a>
                      )}
                    </div>
                  ) : p.note ? (
                    <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"6px 16px",color:"#555",fontSize:12,whiteSpace:"nowrap" }}>
                      {p.note}
                    </div>
                  ) : p.authUrl && p.active ? (
                    <a
                      href={p.authUrl}
                      style={{ background:"linear-gradient(135deg,#C9A84C,#8B6914)",borderRadius:20,padding:"8px 22px",color:"#000",fontSize:13,fontWeight:700,cursor:"pointer",textDecoration:"none",display:"inline-block",whiteSpace:"nowrap" }}
                    >
                      ربط الحساب
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign:"center",marginTop:36,color:"#2a2a2a",fontSize:12 }}>
          sardhahab.com · التوكنات محفوظة في Supabase · تتجدد تلقائياً
        </div>
      </div>
    </div>
  );
}

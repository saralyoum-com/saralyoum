"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageContext";

type Status = "idle" | "sending" | "sent" | "error";

const txt = {
  ar: {
    title: "تواصل معنا",
    subtitle: "لديك سؤال أو اقتراح؟ نحن هنا.",
    name: "الاسم",
    namePh: "اكتب اسمك",
    email: "البريد الإلكتروني",
    emailPh: "example@email.com",
    message: "الرسالة",
    messagePh: "اكتب رسالتك هنا…",
    send: "إرسال",
    sending: "جارٍ الإرسال…",
    sent: "✅ وصلت رسالتك! سنرد عليك قريباً.",
    error: "حدث خطأ. يُرجى المحاولة لاحقاً.",
  },
  en: {
    title: "Contact Us",
    subtitle: "Have a question or suggestion? We're here.",
    name: "Name",
    namePh: "Your name",
    email: "Email",
    emailPh: "example@email.com",
    message: "Message",
    messagePh: "Write your message here…",
    send: "Send",
    sending: "Sending…",
    sent: "✅ Message received! We'll get back to you soon.",
    error: "Something went wrong. Please try again later.",
  },
};

export default function ContactForm() {
  const { lang } = useLang();
  const t = txt[lang];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFieldError(lang === "ar" ? "جميع الحقول مطلوبة" : "All fields are required");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFieldError(data.error || t.error);
        setStatus("error");
        return;
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setFieldError(t.error);
    }
  }

  return (
    <div className="border-t border-border pt-8 mt-2">
      <div className="max-w-xl mx-auto">
        <h3 className="text-text-primary font-bold text-lg mb-1">{t.title}</h3>
        <p className="text-text-secondary text-sm mb-5">{t.subtitle}</p>

        {status === "sent" ? (
          <div className="bg-rise/10 border border-rise/30 rounded-2xl p-5 text-rise text-sm font-medium text-center">
            {t.sent}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-text-secondary text-xs font-medium">{t.name}</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t.namePh}
                  maxLength={80}
                  className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-text-secondary text-xs font-medium">{t.email}</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t.emailPh}
                  maxLength={120}
                  className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-text-secondary text-xs font-medium">{t.message}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t.messagePh}
                rows={4}
                maxLength={2000}
                className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
              <span className="text-text-secondary/40 text-xs text-end">{form.message.length}/2000</span>
            </div>

            {fieldError && (
              <p className="text-fall text-xs font-medium">{fieldError}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="self-start bg-gold hover:bg-gold-light disabled:opacity-50 text-black font-bold text-sm px-6 py-2.5 rounded-xl transition-colors"
            >
              {status === "sending" ? t.sending : t.send}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

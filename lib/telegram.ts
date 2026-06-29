async function _send(chatId: string, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN missing");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}

export async function sendTelegramMessage(text: string): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) throw new Error("TELEGRAM_CHAT_ID missing");
  return _send(chatId, text);
}

// Sends to the owner's personal chat for manual-review posts (LinkedIn, etc.)
export async function sendTelegramToOwner(text: string): Promise<void> {
  const chatId = process.env.OWNER_TELEGRAM_CHAT_ID ?? "1839726381";
  return _send(chatId, text);
}

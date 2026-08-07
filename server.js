require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const providerToken = process.env.TELEGRAM_PROVIDER_TOKEN;
const botUsername = process.env.TELEGRAM_BOT_USERNAME;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/payments/create-invoice-link", async (req, res) => {
  try {
    if (!botToken || !providerToken || !botUsername) {
      return res.status(500).json({
        ok: false,
        error:
          "Missing TELEGRAM_BOT_TOKEN, TELEGRAM_PROVIDER_TOKEN, or TELEGRAM_BOT_USERNAME in environment."
      });
    }

    const { planKey, amount, currency } = req.body || {};

    if (!planKey || typeof planKey !== "string") {
      return res.status(400).json({ ok: false, error: "Invalid planKey." });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ ok: false, error: "Amount must be a positive number." });
    }

    const paymentCurrency = typeof currency === "string" ? currency.toUpperCase() : "USD";

    const title = `Bank Transfer ${planKey}`;
    const description = `Payment for ${planKey} via Telegram Payments`;
    const payload = `bank_${planKey}_${Date.now()}`;

    // Telegram expects integer minor units: 12.50 USD -> 1250
    const amountMinor = Math.round(parsedAmount * 100);

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/createInvoiceLink`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          payload,
          provider_token: providerToken,
          currency: paymentCurrency,
          prices: [{ label: `${planKey} payment`, amount: amountMinor }],
          need_email: true,
          send_email_to_provider: true,
          is_flexible: false
        })
      }
    );

    const invoiceData = await telegramResponse.json();

    if (!invoiceData.ok) {
      return res.status(400).json({
        ok: false,
        error: invoiceData.description || "Telegram API createInvoiceLink failed."
      });
    }

    return res.json({
      ok: true,
      invoiceLink: invoiceData.result,
      botLink: `https://t.me/${botUsername}`
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error."
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

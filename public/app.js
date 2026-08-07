const paymentForm = document.getElementById("paymentForm");
const statusEl = document.getElementById("status");
const payBtn = document.getElementById("payBtn");
const openHubBtn = document.getElementById("openHubBtn");
const openTermsBtn = document.getElementById("openTermsBtn");
const closeHubBtn = document.getElementById("closeHubBtn");
const investmentsHubPage = document.getElementById("investmentsHubPage");
const termsCard = document.getElementById("termsCard");
const shell = document.querySelector(".shell");

const appConfig = window.BANK_APP_CONFIG || {};
const normalizedApiBase = String(appConfig.apiBaseUrl || "/api").replace(/\/$/, "");
const invoiceEndpoint = `${normalizedApiBase}/payments/create-invoice-link`;

function openHubPage() {
  if (!investmentsHubPage || !shell) {
    return;
  }

  investmentsHubPage.hidden = false;
  shell.hidden = true;
  investmentsHubPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeHubPage() {
  if (!investmentsHubPage || !shell) {
    return;
  }

  investmentsHubPage.hidden = true;
  shell.hidden = false;
  shell.scrollIntoView({ behavior: "smooth", block: "start" });
}

openHubBtn?.addEventListener("click", openHubPage);
openTermsBtn?.addEventListener("click", () => {
  openHubPage();
  termsCard?.scrollIntoView({ behavior: "smooth", block: "start" });
});
closeHubBtn?.addEventListener("click", closeHubPage);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && investmentsHubPage && !investmentsHubPage.hidden) {
    closeHubPage();
  }
});

paymentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const planKey = document.getElementById("planKey")?.value;
  const amount = Number(document.getElementById("amount")?.value);

  statusEl.textContent = "Creating Telegram invoice link...";
  statusEl.className = "";
  payBtn.disabled = true;

  try {
    const response = await fetch(invoiceEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey,
        amount,
        currency: "USD"
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok || !data.invoiceLink) {
      throw new Error(data.error || "Unable to create payment invoice.");
    }

    statusEl.textContent = "Invoice ready. Redirecting to Telegram checkout...";
    statusEl.className = "success";
    window.open(data.invoiceLink, "_blank", "noopener,noreferrer");
  } catch (error) {
    const fallbackMessage =
      appConfig.botUsername && window.location.hostname.endsWith("github.io")
        ? `Payment API is unavailable. Open Telegram bot @${appConfig.botUsername} directly to continue checkout.`
        : "Payment setup failed.";

    statusEl.textContent = error instanceof Error ? error.message : fallbackMessage;
    statusEl.className = "error";
  } finally {
    payBtn.disabled = false;
  }
});

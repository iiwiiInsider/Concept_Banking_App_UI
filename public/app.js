const openHubBtn = document.getElementById("openHubBtn");
const openTermsBtn = document.getElementById("openTermsBtn");
const closeHubBtn = document.getElementById("closeHubBtn");
const serviceBackBtn = document.getElementById("serviceBackBtn");
const accountBackBtn = document.getElementById("accountBackBtn");
const openAccountsBtn = document.getElementById("openAccountsBtn");
const openCurrencyNavBtn = document.getElementById("openCurrencyNavBtn");
const openExchangeBtn = document.getElementById("openExchangeBtn");
const toggleBalanceBtn = document.getElementById("toggleBalanceBtn");
const balanceAmount = document.getElementById("balanceAmount");
const balanceCurrency = document.getElementById("balanceCurrency");
const balanceCurrencyControl = document.getElementById("balanceCurrencyControl");
const balanceMeta = document.getElementById("balanceMeta");
const investmentMovementTotal = document.getElementById("investmentMovementTotal");
const exchangeMovementTotal = document.getElementById("exchangeMovementTotal");
const accountSelect = document.getElementById("accountSelect");
const activationSelect = document.getElementById("activationSelect");
const activateAccountBtn = document.getElementById("activateAccountBtn");
const selectedWalletName = document.getElementById("selectedWalletName");
const selectedWalletMeta = document.getElementById("selectedWalletMeta");
const selectedWalletBalance = document.getElementById("selectedWalletBalance");
const primarySwitchLabel = document.getElementById("primarySwitchLabel");
const primaryAccountToggle = document.getElementById("primaryAccountToggle");
const openCurrencyAccountBtn = document.getElementById("openCurrencyAccountBtn");
const coveragePanel = document.getElementById("coveragePanel");
const accountDrawer = document.getElementById("accountDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const drawerTitle = document.getElementById("drawerTitle");
const drawerAccountName = document.getElementById("drawerAccountName");
const drawerCurrency = document.getElementById("drawerCurrency");
const drawerStatus = document.getElementById("drawerStatus");
const drawerBalance = document.getElementById("drawerBalance");
const statementMonth = document.getElementById("statementMonth");
const downloadStatementBtn = document.getElementById("downloadStatementBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const deleteHelp = document.getElementById("deleteHelp");
const drawerStatusMessage = document.getElementById("drawerStatusMessage");
const walletCards = document.querySelectorAll(".wallet-card");
const investmentsHubPage = document.getElementById("investmentsHubPage");
const servicePage = document.getElementById("servicePage");
const accountPage = document.getElementById("accountPage");
const serviceTitle = document.getElementById("serviceTitle");
const serviceDescription = document.getElementById("serviceDescription");
const serviceEyebrow = document.getElementById("serviceEyebrow");
const investmentTool = document.getElementById("investmentTool");
const investmentForm = document.getElementById("investmentForm");
const investmentAmount = document.getElementById("investmentAmount");
const selectedInvestmentName = document.getElementById("selectedInvestmentName");
const investmentStatus = document.getElementById("investmentStatus");
const investmentOptions = document.querySelectorAll(".investment-option");
const investmentInfoButtons = document.querySelectorAll(".investment-info");
const investmentInfoPage = document.getElementById("investmentInfoPage");
const investmentInfoBackBtn = document.getElementById("investmentInfoBackBtn");
const investmentInfoTitle = document.getElementById("investmentInfoTitle");
const investmentInfoDescription = document.getElementById("investmentInfoDescription");
const exchangeTool = document.getElementById("exchangeTool");
const exchangeForm = document.getElementById("exchangeForm");
const exchangeFrom = document.getElementById("exchangeFrom");
const exchangeTo = document.getElementById("exchangeTo");
const exchangeAmount = document.getElementById("exchangeAmount");
const exchangeQuote = document.getElementById("exchangeQuote");
const exchangeStatus = document.getElementById("exchangeStatus");
const withdrawTool = document.getElementById("withdrawTool");
const withdrawForm = document.getElementById("withdrawForm");
const withdrawType = document.getElementById("withdrawType");
const withdrawCurrency = document.getElementById("withdrawCurrency");
const withdrawAmount = document.getElementById("withdrawAmount");
const withdrawSubmitBtn = document.getElementById("withdrawSubmitBtn");
const withdrawStatus = document.getElementById("withdrawStatus");
const termsCard = document.getElementById("termsCard");
const shell = document.querySelector(".shell");
const serviceButtons = document.querySelectorAll(".card-option");

const appConfig = window.BANK_APP_CONFIG || {};
const normalizedApiBase = String(appConfig.apiBaseUrl || "/api").replace(/\/$/, "");
const invoiceEndpoint = `${normalizedApiBase}/payments/create-invoice-link`;

const walletData = {
  ZAR: { name: "South African Rand wallet", label: "ZAR", symbol: "R", balance: 50, primary: true, active: true },
  USD: { name: "US Dollar wallet", label: "USD", symbol: "$", balance: 0, active: false },
  EUR: { name: "Euro wallet", label: "EUR", symbol: "€", balance: 0, active: false },
  GBP: { name: "British Pound wallet", label: "GBP", symbol: "£", balance: 0, active: false },
};

const exchangeRatesFromZar = { ZAR: 1, USD: 0.054, EUR: 0.049, GBP: 0.042 };

function formatMoney(amount, currency) {
  const symbols = { ZAR: "R", USD: "$", EUR: "€", GBP: "£" };
  const decimals = 2;
  return `${symbols[currency]}${amount.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function updateMovementLegend(currency) {
  if (investmentMovementTotal) {
    investmentMovementTotal.textContent = `Investments ${formatMoney(0, currency)}`;
  }
  if (exchangeMovementTotal) {
    exchangeMovementTotal.textContent = `Currency Exchange ${formatMoney(0, currency)}`;
  }
}

function updateBalancePreview() {
  if (!balanceAmount || !balanceCurrency || !balanceCurrencyControl) {
    return;
  }

  const activeWallets = Object.values(walletData).filter((wallet) => wallet.active);
  const activeCurrencies = activeWallets.map((wallet) => wallet.label);
  const hasActiveCurrency = activeCurrencies.length > 0;
  balanceCurrencyControl.hidden = !hasActiveCurrency;
  balanceCurrency.querySelectorAll("option").forEach((option) => {
    option.hidden = !activeCurrencies.includes(option.value);
  });

  if (!hasActiveCurrency) {
    balanceAmount.textContent = "No active currency account";
    balanceAmount.classList.add("balance-empty");
    updateMovementLegend("ZAR");
  } else {
    balanceAmount.classList.remove("balance-empty");
    const primaryWallet = activeWallets.find((wallet) => wallet.primary) || activeWallets[0];
    const selectedCurrency = activeCurrencies.includes(balanceCurrency.value) ? balanceCurrency.value : primaryWallet.label;
    balanceCurrency.value = selectedCurrency;
    const totalInZar = activeWallets.reduce((total, wallet) => total + wallet.balance / exchangeRatesFromZar[wallet.label], 0);
    balanceAmount.textContent = formatMoney(totalInZar * exchangeRatesFromZar[selectedCurrency], selectedCurrency);
    updateMovementLegend(selectedCurrency);
  }

  if (balanceMeta) {
    balanceMeta.textContent = hasActiveCurrency
      ? `Total across ${activeWallets.length} active currency wallet${activeWallets.length === 1 ? "" : "s"}`
      : "Open a currency account to view a balance";
  }
}

function updateAccountOptions() {
  if (!accountSelect) {
    return;
  }

  const activeWallets = Object.values(walletData).filter((wallet) => wallet.active);
  const currentValue = accountSelect.value;
  accountSelect.replaceChildren();

  if (activeWallets.length === 0) {
    const emptyOption = new Option("No active currency accounts", "", true, true);
    emptyOption.disabled = true;
    accountSelect.append(emptyOption);
    updateActivationOptions();
    return;
  }

  activeWallets.forEach((wallet) => {
    accountSelect.append(new Option(`${wallet.name.replace(" wallet", "")} (${wallet.label})`, wallet.label));
  });

  accountSelect.value = activeWallets.some((wallet) => wallet.label === currentValue) ? currentValue : activeWallets[0].label;
  updateActivationOptions();
}

function updateActivationOptions() {
  if (!activationSelect || !activateAccountBtn) {
    return;
  }

  const inactiveWallets = Object.values(walletData).filter((wallet) => !wallet.active);
  activationSelect.replaceChildren();
  inactiveWallets.forEach((wallet) => {
    activationSelect.append(new Option(`${wallet.name.replace(" wallet", "")} (${wallet.label})`, wallet.label));
  });
  activationSelect.disabled = inactiveWallets.length === 0;
  activateAccountBtn.disabled = inactiveWallets.length === 0;
  if (inactiveWallets.length === 0) {
    activationSelect.append(new Option("All currency accounts active", "", true, true));
  }
}

function updateSelectedWallet() {
  if (!accountSelect || !selectedWalletName || !selectedWalletMeta || !selectedWalletBalance) {
    return;
  }

  const selectedWallet = walletData[accountSelect.value];
  if (!selectedWallet) {
    selectedWalletName.textContent = "No active currency account";
    selectedWalletMeta.textContent = "Open a currency account to continue";
    selectedWalletBalance.textContent = "";
    openCurrencyAccountBtn.disabled = true;
    return;
  }

  openCurrencyAccountBtn.disabled = false;
  selectedWalletName.textContent = selectedWallet.name;
  selectedWalletMeta.textContent = `${selectedWallet.primary ? "Primary account" : "Currency account"} · ${selectedWallet.active ? "Active" : "Inactive"}`;
  selectedWalletBalance.textContent = formatMoney(selectedWallet.balance, selectedWallet.label);
  primarySwitchLabel.hidden = selectedWallet.primary;
  primaryAccountToggle.checked = selectedWallet.primary;
  walletCards.forEach((card) => {
    const wallet = walletData[card.dataset.wallet];
    const statusEl = card.querySelector(".wallet-status");
    card.hidden = !wallet.active;
    if (statusEl) {
      statusEl.textContent = `${wallet.primary ? "Primary · " : ""}${wallet.active ? "Active" : "Inactive"}`;
    }
    card.classList.toggle("wallet-card-selected", card.dataset.wallet === accountSelect.value);
  });
  openCurrencyAccountBtn.textContent = selectedWallet.active ? "Manage Currency Account" : "Open Currency Account";
  updateDrawer();
}

function setPrimaryAccount(currency) {
  const selectedWallet = walletData[currency];
  if (!selectedWallet || !selectedWallet.active || selectedWallet.primary) {
    return;
  }

  Object.values(walletData).forEach((wallet) => {
    wallet.primary = wallet.label === currency;
  });
  balanceCurrency.value = currency;
  updateSelectedWallet();
  updateBalancePreview();
}

function updateDrawer() {
  if (!accountSelect || !drawerAccountName) {
    return;
  }

  const selectedWallet = walletData[accountSelect.value];
  drawerTitle.textContent = `${selectedWallet.label} account controls`;
  drawerAccountName.textContent = selectedWallet.name;
  drawerCurrency.textContent = selectedWallet.label;
  drawerStatus.textContent = selectedWallet.active ? "Active" : "Inactive";
  drawerBalance.textContent = formatMoney(selectedWallet.balance, selectedWallet.label);

  const canDelete = selectedWallet.active && selectedWallet.balance === 0;
  deleteAccountBtn.disabled = !canDelete;
  deleteHelp.textContent = canDelete
    ? "This account has a zero balance and can be deleted."
    : selectedWallet.active
      ? "This account cannot be deleted until its balance is zero."
      : "Open the account before managing or deleting it.";
}

function openAccountDrawer() {
  if (!accountDrawer || !drawerBackdrop) {
    return;
  }

  updateDrawer();
  accountDrawer.hidden = false;
  requestAnimationFrame(() => accountDrawer.classList.add("drawer-open"));
  accountDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-is-open");
}

function closeAccountDrawer() {
  if (!accountDrawer || !drawerBackdrop) {
    return;
  }

  accountDrawer.classList.remove("drawer-open");
  accountDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-is-open");
  window.setTimeout(() => {
    if (!accountDrawer.classList.contains("drawer-open")) {
      accountDrawer.hidden = true;
    }
  }, 280);
}

const serviceContent = {
  Investments: {
    title: "Investment Services",
    description: "Access private market updates, portfolio guidance, and structured investment opportunities.",
    eyebrow: "Investments"
  },
  FloatingCurrency: {
    title: "Currency Exchange",
    description: "Exchange funds between your separate currency wallets and manage conversion support for global transfers.",
    eyebrow: "Currency Exchange"
  },
  WithdrawDeposit: {
    title: "Withdraw / Deposit",
    description: "Move funds in and out securely with quick support for deposits, withdrawals, and account transfers.",
    eyebrow: "Cash Flow"
  }
};

function openHubPage() {
  if (!investmentsHubPage || !shell) {
    return;
  }

  investmentsHubPage.hidden = false;
  shell.hidden = true;
  if (servicePage) {
    servicePage.hidden = true;
  }
  if (accountPage) {
    accountPage.hidden = true;
  }
  if (investmentInfoPage) {
    investmentInfoPage.hidden = true;
  }
  investmentsHubPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeHubPage() {
  if (!investmentsHubPage || !shell) {
    return;
  }

  investmentsHubPage.hidden = true;
  if (servicePage) {
    servicePage.hidden = true;
  }
  if (accountPage) {
    accountPage.hidden = true;
  }
  if (investmentInfoPage) {
    investmentInfoPage.hidden = true;
  }
  shell.hidden = false;
  shell.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openServicePage(serviceKey) {
  if (!servicePage || !shell || !serviceTitle || !serviceDescription || !serviceEyebrow) {
    return;
  }

  const selectedService = serviceContent[serviceKey] || serviceContent.Investments;
  serviceTitle.textContent = selectedService.title;
  serviceDescription.textContent = selectedService.description;
  serviceEyebrow.textContent = selectedService.eyebrow;
  if (exchangeTool) {
    exchangeTool.hidden = serviceKey !== "FloatingCurrency";
  }
  if (investmentTool) {
    investmentTool.hidden = serviceKey !== "Investments";
  }
  if (withdrawTool) {
    withdrawTool.hidden = serviceKey !== "WithdrawDeposit";
  }
  if (serviceKey === "FloatingCurrency") {
    updateExchangeOptions();
  }
  servicePage.hidden = false;
  shell.hidden = true;
  investmentsHubPage.hidden = true;
  if (accountPage) {
    accountPage.hidden = true;
  }
  if (investmentInfoPage) {
    investmentInfoPage.hidden = true;
  }
  servicePage.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openInvestmentInfo(investmentKey) {
  if (!investmentInfoPage || !investmentInfoTitle || !investmentInfoDescription || !servicePage || !shell) {
    return;
  }

  const investmentDescriptions = {
    prime: "Learn how the Prime monthly payout account is intended to work and what information will be provided before opening.",
    riskReward: "Learn about the Risk/Reward Account structure, its changing outcomes, and the information that will be provided before opening.",
    bundles: "Learn how the Bundles Account groups investment themes and what information will be provided before opening."
  };

  investmentInfoTitle.textContent = investmentAccounts[investmentKey] || "Investment account details";
  investmentInfoDescription.textContent = investmentDescriptions[investmentKey] || "More information about this account will be added here.";
  servicePage.hidden = true;
  shell.hidden = true;
  investmentsHubPage.hidden = true;
  accountPage.hidden = true;
  investmentInfoPage.hidden = false;
  investmentInfoPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

const investmentAccounts = {
  prime: "Prime monthly payout account",
  riskReward: "Risk/Reward Account",
  bundles: "Bundles Account"
};

investmentOptions.forEach((option) => {
  option.querySelector(".investment-select")?.addEventListener("click", () => {
    investmentOptions.forEach((item) => item.classList.remove("investment-option-selected"));
    option.classList.add("investment-option-selected");
    selectedInvestmentName.textContent = investmentAccounts[option.dataset.investment];
    investmentForm.hidden = false;
    investmentStatus.textContent = "";
    investmentForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

investmentInfoButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openInvestmentInfo(button.closest(".investment-option")?.dataset.investment);
  });
});

investmentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(investmentAmount.value);
  if (amount < 0) {
    investmentStatus.textContent = "Starting amount cannot be negative.";
    investmentStatus.className = "investment-status error";
    return;
  }

  investmentStatus.textContent = `${selectedInvestmentName.textContent} is ready to open with R${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`;
  investmentStatus.className = "investment-status success";
});

withdrawForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const transactionType = withdrawType.value;
  const currency = withdrawCurrency.value;
  const amount = Number(withdrawAmount.value);
  withdrawStatus.textContent = "Creating Telegram invoice link...";
  withdrawStatus.className = "withdraw-status";
  withdrawSubmitBtn.disabled = true;

  try {
    const response = await fetch(invoiceEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planKey: "WithdrawDeposit",
        amount,
        currency,
        transactionType
      })
    });
    const data = await response.json();

    if (!response.ok || !data.ok || !data.invoiceLink) {
      throw new Error(data.error || "Unable to create the Telegram invoice.");
    }

    withdrawStatus.textContent = "Invoice ready. Opening Telegram checkout...";
    withdrawStatus.className = "withdraw-status success";
    window.open(data.invoiceLink, "_blank", "noopener,noreferrer");
  } catch (error) {
    withdrawStatus.textContent = error instanceof Error ? error.message : "Payment setup failed.";
    withdrawStatus.className = "withdraw-status error";
  } finally {
    withdrawSubmitBtn.disabled = false;
  }
});

function openAccountPage() {
  if (!accountPage || !shell) {
    return;
  }

  accountPage.hidden = false;
  shell.hidden = true;
  investmentsHubPage.hidden = true;
  servicePage.hidden = true;
  accountPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openServicePage(button.dataset.service);
  });
});

openAccountsBtn?.addEventListener("click", openAccountPage);
openExchangeBtn?.addEventListener("click", () => openServicePage("FloatingCurrency"));
openTermsBtn?.addEventListener("click", () => {
  openHubPage();
});
closeHubBtn?.addEventListener("click", closeHubPage);
serviceBackBtn?.addEventListener("click", closeHubPage);
investmentInfoBackBtn?.addEventListener("click", () => {
  investmentInfoPage.hidden = true;
  servicePage.hidden = false;
  servicePage.scrollIntoView({ behavior: "smooth", block: "start" });
});
accountBackBtn?.addEventListener("click", closeHubPage);

toggleBalanceBtn?.addEventListener("click", () => {
  const isHidden = balanceAmount?.classList.toggle("amount-hidden");
  toggleBalanceBtn.textContent = isHidden ? "Show amount" : "Hide amount";
  toggleBalanceBtn.setAttribute("aria-pressed", String(Boolean(isHidden)));
});

balanceCurrency?.addEventListener("change", updateBalancePreview);
accountSelect?.addEventListener("change", updateSelectedWallet);
primaryAccountToggle?.addEventListener("change", () => {
  if (primaryAccountToggle.checked) {
    setPrimaryAccount(accountSelect.value);
  }
});
activateAccountBtn?.addEventListener("click", () => {
  const selectedCurrency = activationSelect.value;
  const selectedWallet = walletData[selectedCurrency];
  if (!selectedWallet || selectedWallet.active) {
    return;
  }

  selectedWallet.active = true;
  updateAccountOptions();
  accountSelect.value = selectedCurrency;
  updateSelectedWallet();
  updateBalancePreview();
});
openCurrencyAccountBtn?.addEventListener("click", () => {
  const selectedWallet = walletData[accountSelect.value];
  if (selectedWallet.active) {
    openAccountDrawer();
    return;
  }

  selectedWallet.active = true;
  updateAccountOptions();
  updateSelectedWallet();
  updateBalancePreview();
  coveragePanel.hidden = false;
  coveragePanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

function updateExchangeOptions() {
  if (!exchangeFrom || !exchangeTo) {
    return;
  }

  const activeWallets = Object.values(walletData).filter((wallet) => wallet.active);
  const previousFrom = exchangeFrom.value;
  exchangeFrom.replaceChildren();
  activeWallets.forEach((wallet) => exchangeFrom.append(new Option(`${wallet.name.replace(" wallet", "")} (${wallet.label})`, wallet.label)));
  exchangeFrom.value = activeWallets.some((wallet) => wallet.label === previousFrom) ? previousFrom : activeWallets[0]?.label || "";

  const previousTo = exchangeTo.value;
  exchangeTo.replaceChildren();
  Object.values(walletData).forEach((wallet) => {
    if (wallet.label !== exchangeFrom.value) {
      exchangeTo.append(new Option(`${wallet.name.replace(" wallet", "")} (${wallet.label})`, wallet.label));
    }
  });
  exchangeTo.value = [...exchangeTo.options].some((option) => option.value === previousTo) ? previousTo : exchangeTo.options[0]?.value || "";
  updateExchangeQuote();
}

function updateExchangeQuote() {
  if (!exchangeFrom || !exchangeTo || !exchangeAmount || !exchangeQuote || !exchangeFrom.value || !exchangeTo.value) {
    return;
  }

  const amount = Number(exchangeAmount.value) || 0;
  const amountInZar = amount / exchangeRatesFromZar[exchangeFrom.value];
  const convertedAmount = amountInZar * exchangeRatesFromZar[exchangeTo.value];
  exchangeQuote.textContent = formatMoney(convertedAmount, exchangeTo.value);
}

exchangeFrom?.addEventListener("change", updateExchangeOptions);
exchangeTo?.addEventListener("change", updateExchangeQuote);
exchangeAmount?.addEventListener("input", updateExchangeQuote);
exchangeForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const sourceWallet = walletData[exchangeFrom.value];
  const amount = Number(exchangeAmount.value);

  if (!sourceWallet || amount <= 0) {
    exchangeStatus.textContent = "Enter a valid exchange amount.";
    exchangeStatus.className = "exchange-status error";
    return;
  }

  if (amount > sourceWallet.balance) {
    exchangeStatus.textContent = `Exchange unavailable. ${sourceWallet.label} balance is ${formatMoney(sourceWallet.balance, sourceWallet.label)}.`;
    exchangeStatus.className = "exchange-status error";
    return;
  }

  exchangeStatus.textContent = `Exchange preview ready: ${formatMoney(amount, sourceWallet.label)} to ${exchangeQuote.textContent}.`;
  exchangeStatus.className = "exchange-status success";
});
closeDrawerBtn?.addEventListener("click", closeAccountDrawer);
drawerBackdrop?.addEventListener("click", closeAccountDrawer);
downloadStatementBtn?.addEventListener("click", () => {
  const selectedWallet = walletData[accountSelect.value];
  const statement = [
    "Bank Portal Monthly Statement",
    `Account: ${selectedWallet.name}`,
    `Currency: ${selectedWallet.label}`,
    `Month: ${statementMonth.value}`,
    `Opening balance: ${formatMoney(selectedWallet.balance, selectedWallet.label)}`,
    "Transactions: None",
    `Closing balance: ${formatMoney(selectedWallet.balance, selectedWallet.label)}`
  ].join("\n");
  const statementUrl = URL.createObjectURL(new Blob([statement], { type: "text/plain" }));
  const downloadLink = document.createElement("a");
  downloadLink.href = statementUrl;
  downloadLink.download = `${selectedWallet.label}-${statementMonth.value}-statement.txt`;
  downloadLink.click();
  URL.revokeObjectURL(statementUrl);
  drawerStatusMessage.textContent = "Statement download started.";
  drawerStatusMessage.className = "drawer-status success";
});
deleteAccountBtn?.addEventListener("click", () => {
  const selectedWallet = walletData[accountSelect.value];
  if (!selectedWallet.active || selectedWallet.balance !== 0) {
    drawerStatusMessage.textContent = "Only active accounts with a zero balance can be deleted.";
    drawerStatusMessage.className = "drawer-status error";
    return;
  }

  selectedWallet.active = false;
  closeAccountDrawer();
  updateAccountOptions();
  updateExchangeOptions();
  updateSelectedWallet();
  updateBalancePreview();
});
updateBalancePreview();
updateAccountOptions();
updateActivationOptions();
updateSelectedWallet();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && accountDrawer?.classList.contains("drawer-open")) {
    closeAccountDrawer();
  } else if (event.key === "Escape" && investmentInfoPage && !investmentInfoPage.hidden) {
    investmentInfoPage.hidden = true;
    servicePage.hidden = false;
  } else if (event.key === "Escape" && (investmentsHubPage && !investmentsHubPage.hidden || servicePage && !servicePage.hidden || accountPage && !accountPage.hidden)) {
    closeHubPage();
  }
});


const API_URL = "http://localhost:8000";
const FRONTEND_URL = "http://localhost:5173";

const SOURCE_LABELS = {
  ml_model: "ML Model",
  community_report: "Community Report",
  shopping_list: "Shopping List",
  validation: "Validation",
};

document.addEventListener("DOMContentLoaded", () => {
  const currentUrlEl = document.getElementById("currentUrl");
  const scanBtn = document.getElementById("scanBtn");
  const scanBtnText = document.getElementById("scanBtnText");
  const reportBtn = document.getElementById("reportBtn");
  const openFrontendBtn = document.getElementById("openFrontendBtn");
  const statusCard = document.getElementById("statusCard");
  const resultCard = document.getElementById("resultCard");

  let activeTabUrl = "";
  let lastResult = null;

  // Get the current active tab URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      try {
        const parsed = new URL(tabs[0].url);
        activeTabUrl = `${parsed.protocol}//${parsed.hostname}`;
        currentUrlEl.textContent = activeTabUrl;
      } catch (e) {
        activeTabUrl = tabs[0].url;
        currentUrlEl.textContent = tabs[0].url;
      }
    } else {
      currentUrlEl.textContent = "No URL detected";
    }
  });

  function showResult(data) {
    lastResult = data;
    statusCard.style.display = "none";
    resultCard.style.display = "block";

    const isSafe = data.category === "Benign";
    const isShopping = data.category === "Shopping";
    const iconEl = document.getElementById("resultIcon");
    const titleEl = document.getElementById("resultTitle");
    const subtitleEl = document.getElementById("resultSubtitle");

    if (isSafe) {
      iconEl.className = "result-icon result-icon--safe";
      iconEl.innerHTML = "&#10003;";
      titleEl.textContent = "URL Appears Safe";
      subtitleEl.textContent = "No malicious patterns detected.";
      resultCard.className = "result-card result-card--safe";
    } else if (isShopping) {
      iconEl.className = "result-icon result-icon--warning";
      iconEl.innerHTML = "!";
      titleEl.textContent = "Shopping Site Detected";
      subtitleEl.textContent = "Flagged for additional scrutiny.";
      resultCard.className = "result-card result-card--warning";
    } else {
      iconEl.className = "result-icon result-icon--danger";
      iconEl.innerHTML = "&#10007;";
      titleEl.textContent = "Threat Detected";
      subtitleEl.textContent = "This URL has been flagged as dangerous.";
      resultCard.className = "result-card result-card--danger";
    }

    document.getElementById("metricCategory").textContent =
      data.category.toUpperCase();

    const pct = Math.round(data.confidence * 100) + "%";
    const confEl = document.getElementById("metricConfidence");
    confEl.textContent = pct;
    confEl.className =
      "metric-badge " +
      (data.confidence >= 0.85
        ? "badge-danger"
        : data.confidence >= 0.5
          ? "badge-warning"
          : "badge-safe");

    document.getElementById("metricSource").textContent =
      SOURCE_LABELS[data.source] || data.source;
  }

  function showError(msg) {
    statusCard.style.display = "block";
    resultCard.style.display = "none";
    const dot = document.getElementById("statusDot");
    const label = document.getElementById("statusLabel");
    const message = document.getElementById("statusMessage");
    dot.classList.add("danger");
    label.textContent = "Scan Failed";
    message.innerHTML = `<strong>${msg}</strong>`;
  }

  // Scan button — scan inline
  scanBtn.addEventListener("click", () => {
    if (!activeTabUrl || activeTabUrl.startsWith("chrome://")) {
      showError("Cannot scan this page.");
      return;
    }

    scanBtn.disabled = true;
    scanBtnText.textContent = "Scanning...";

    fetch(`${API_URL}/prediction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: activeTabUrl }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server error (${res.status})`);
        return res.json();
      })
      .then((data) => showResult(data))
      .catch((err) => showError(err.message || "Could not reach Kraven API."))
      .finally(() => {
        scanBtn.disabled = false;
        scanBtnText.textContent = "Scan Current Page";
      });
  });

  // Report button — opens frontend report form with URL + category prefilled
  reportBtn.addEventListener("click", () => {
    const params = new URLSearchParams();
    if (activeTabUrl) params.set("url", activeTabUrl);
    if (lastResult && lastResult.category) {
      params.set("threat_category", lastResult.category);
    }
    window.open(`${FRONTEND_URL}/report?${params.toString()}`);
  });

  // Open full dashboard
  openFrontendBtn.addEventListener("click", () => {
    if (activeTabUrl) {
      window.open(
        `${FRONTEND_URL}/scan?url=${encodeURIComponent(activeTabUrl)}`,
      );
    } else {
      window.open(FRONTEND_URL);
    }
  });
});

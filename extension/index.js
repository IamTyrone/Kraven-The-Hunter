document.addEventListener("DOMContentLoaded", () => {
  const currentUrlEl = document.getElementById("currentUrl");
  const scanBtn = document.getElementById("scanBtn");
  const reportBtn = document.getElementById("reportBtn");

  let activeTabUrl = "";

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

  // Scan button — opens the frontend scanner with the current URL pre-filled
  scanBtn.addEventListener("click", () => {
    if (activeTabUrl) {
      window.open(
        `http://localhost:5173/scan?url=${encodeURIComponent(activeTabUrl)}`,
      );
    } else {
      window.open("http://localhost:5173/scan");
    }
  });

  // Report button — opens the frontend report form
  reportBtn.addEventListener("click", () => {
    window.open("http://localhost:5173/report");
  });
});

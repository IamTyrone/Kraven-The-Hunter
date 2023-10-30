function reddenPage() {
  document.body.style.backgroundColor = "red";
}

// chrome.action.onClicked.addListener((tab) => {
//   console.log(tab.url);
//   if (!tab.url.includes("chrome://")) {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: reddenPage,
//     });
//   }
// });

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["navigate.js"],
  });
});

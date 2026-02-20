let currentUrl = window.location.href.split("?")[0];
try {
  const firstPart = currentUrl.split("//")[0];
  const secondPart = currentUrl.split("//")[1].split("/")[0];
  currentUrl = `${firstPart}//${secondPart}`;
} catch (e) {}

const kravenNavigator = () => {
  if (currentUrl.includes("localhost") || currentUrl.includes("chrome://")) {
    return;
  }

  fetch("http://localhost:8000/prediction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: currentUrl,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        window.open(
          `http://localhost:5173/warning?category=${data.category}&url=${encodeURIComponent(currentUrl)}`,
        );
      }
    })
    .catch(() => {});
};

kravenNavigator();

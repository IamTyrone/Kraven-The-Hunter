let currentUrl = window.location.href.split("?")[0];
try {
  const firstPart = currentUrl.split("//")[0];
  const secondPart = currentUrl.split("//")[1].split("/")[0];
  currentUrl = `${firstPart}//${secondPart}`;
} catch (e) {}

const navigator = () => {
  fetch("http://localhost:8000/prediction", {
    method: "POST", // Specify the method as POST
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify({
      url: currentUrl,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (res.data.url_status) {
        // is malicious
        window.close();

        window.open(`https://localhost:5174/warning?category=${data.category}`);
      }
    })
    .catch((err) => {});
};

navigator();

try {
  document.getElementById("myBtn").addEventListener("click", () => {
    window.open(`https://localhost:5174/scan?url=${currentUrl}`);
  });
} catch (err) {
  console.log(err);
}

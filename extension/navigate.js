let currentUrl = window.location.href.split("?")[0];
try {
  const firstPart = currentUrl.split("//")[0];
  const secondPart = currentUrl.split("//")[1].split("/")[0];
  currentUrl = `${firstPart}//${secondPart}`;
} catch (e) {}

const navigator = () => {
  fetch("http://localhost:8000/api/v1/get-url?url=" + currentUrl)
    .then((res) => res.json())
    .then((data) => {
      if (res.data.url_status) {
        // is malicious
        window.close();

        window.open(`https://localhost:3000?url=${currentUrl}`);
      }
    })
    .catch((err) => {});
};

navigator();

try {
  document.getElementById("myBtn").addEventListener("click", () => {
    window.open(`https://localhost:3000?url=${currentUrl}`);
  });
} catch (err) {
  console.log(err);
}

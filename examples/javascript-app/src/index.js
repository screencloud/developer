import "./style.css";

(async function () {
  console.log("Hello there JS world!");
  const quoteElement = document.querySelector(".quote");

  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    if (response.status !== 200) {
      throw response;
    }
    const data = await response.json();
    quoteElement.textContent = data.value;
  } catch (err) {
    console.warn("Something went wrong loading your data.");
    console.warn(err);
  }
})();

import "./style.css";

/**
 * Fetch a random quote.
 * Uses the excellent, free API at: https://api.chucknorris.io/
 *
 * @return {string} A single quote.
 */
async function fetchRandomQuote() {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    if (response.status !== 200) {
      throw response;
    }
    const data = await response.json();
    return data.value;
  } catch (err) {
    console.warn("Something went wrong loading your data.");
    console.warn(err);
  }
}

/**
 * Update the current on-screen quote.
 */
async function updateQuote() {
  const quoteElement = document.querySelector(".quote");
  const quoteText = await fetchRandomQuote();
  quoteElement.textContent = quoteText;
}

/**
 * Starts up the app.
 */
async function start() {
  setInterval(updateQuote, 10000);
  updateQuote();
}

// Kick off your app!
start();

import "./style.css";

/**
 * Fetch a random quote.
 * Uses the excellent, free API at: https://icanhazdadjoke.com/api
 *
 * @return {string} A single quote.
 */
async function fetchRandomQuote() {
  try {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });
    if (response.status !== 200) {
      throw response;
    }
    const data = await response.json();
    return data.joke;
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

  // Not foolproof, but try to deal with the odd overly-long quote too.
  if (quoteText.length > 180) {
    quoteElement.classList.add("small-text");
  } else {
    quoteElement.classList.remove("small-text");
  }

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

import { connectScreenCloud } from "@screencloud/apps-sdk";
import { InitializeMessagePayload } from "@screencloud/apps-sdk/lib/types";
import "./style.scss";

interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

interface AppConfig {
  refreshTimeSeconds: number;
}

/**
 * Fetch a random quote.
 * Uses the excellent, free API at: https://icanhazdadjoke.com/api
 *
 * @return {string} A single quote.
 */
async function fetchRandomQuote(): Promise<string> {
  try {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });
    if (response.status !== 200) {
      throw response;
    }
    const data = (await response.json()) as JokeResponse;
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
  let testData: Partial<InitializeMessagePayload<AppConfig>>;

  if (process.env.NODE_ENV === "development") {
    testData = {
      config: {
        refreshTimeSeconds: 10,
      },
    };
  }

  const sc = await connectScreenCloud<AppConfig>(testData);
  const refreshTime = sc.getConfig().refreshTimeSeconds * 1000;

  // Fetch our initial data immediately.
  updateQuote();

  /**
   * When app is started (i.e. visible on screen), start the timer to refresh quotes periodically.
   */
  sc.onAppStarted().then(() => {
    setInterval(updateQuote, refreshTime);
  });
}

// Kick off your app!
start();

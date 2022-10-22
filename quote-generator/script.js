const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const loader = document.getElementById("loader");

let quotes = [];

function renderQuote() {
  const quote = getRandomQuote();
  addLongQuoteClass(quote);
  parseQuoteAsText(quote);
}

function parseQuoteAsText(quote) {
  quoteText.textContent = quote.text;
  authorText.textContent = quote.author ? quote.author : "Unknown";
}

function addLongQuoteClass(quote) {
  if (quote.text.length > 120) {
    quoteText.classList.add("long-quote");
  } else {
    quoteText.classList.remove("long-quote");
  }
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

async function showQuote() {
  showLoadingSpinner();
  quotes = await getQuotesFromApi();
  renderQuote();
  removeLoadingSpinner();
}

async function getQuotesFromApi() {
  const apiUrl = "https://jacintodesign.github.io/quotes-api/data/quotes.json";
  const res = await fetch(apiUrl);
  return await res.json();
}

function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  loader.hidden = true;
  quoteContainer.hidden = false;
}

function shareQuoteOnTwitter() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
  window.open(twitterUrl, "_blank");
}

document.getElementById("new-quote").addEventListener("click", renderQuote);
document.getElementById("twitter").addEventListener("click", shareQuoteOnTwitter);
showQuote();

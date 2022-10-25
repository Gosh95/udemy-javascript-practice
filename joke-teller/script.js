const jokeContainer = document.getElementById("joke-container");
const jokeText = document.getElementById("joke-text");
const button = document.getElementById("button");
const audioElement = document.getElementById("audio");

async function getJokes() {
  const joke = await loadJoke(1);
  displayJoke(joke);
  tellJoke(joke);
  toggleButton();
}

async function loadJoke(cnt) {
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";
  try {
    const res = await fetch(apiUrl);
    const jokes = await res.json();
    return jokes.joke;
  } catch (err) {
    if (cnt == 3) {
      alert("Faield to load jokes from api.");
      return;
    }
    alert(`Retry to load jokes. (${cnt})`);
    loadJoke(cnt + 1);
  }
}

function displayJoke(joke) {
  if (jokeContainer.hidden) {
    jokeContainer.hidden = false;
  }
  jokeText.textContent = joke;
}

function tellJoke(joke) {
  jokeContainer.hidden = false;
  jokeText.textContent = joke;
  VoiceRSS.speech({
    key: "cc3f1d07454e46389985bd218a1996ad",
    src: `${joke}`,
    hl: "en-us",
    v: "Linda",
    r: 0,
    c: "mp3",
    f: "44khz_16bit_stereo",
    ssml: false,
  });
}

function toggleButton() {
  button.disabled = !button.disabled;
}

button.addEventListener("click", getJokes);
audioElement.addEventListener("ended", toggleButton);

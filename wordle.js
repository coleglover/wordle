// requirements:
// + retrieve word (GET) https://words.dev-apis.com/word-of-the-day
// + retrieve input from users
// + test if input is a valid word (POST) https://words.dev-apis.com/validate-word
//  - if true: compare input to test word
// + repeat until user has guessed:
//  - the word
//  - 6 times

// this function is generated when user clicks "start button"
// function is define as async in order to use await

let word;

async function generateWord() {
  try {
    // fetch is an async function; returns promise
    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    // .json is async; returns a promise
    const wordleData = await response.json();

    word = wordleData.word;
    const puzzleNumber = wordleData.puzzleNumber;

    console.log(`Puzzle number: ${puzzleNumber}\nWord: ${word}`);

    document.querySelector(".puzzle-number").innerHTML =
      "Puzzle number: " + puzzleNumber;
    document.querySelector(".word-to-guess").innerHTML =
      "Word of the day: " + word;
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
document.addEventListener("keyup", (event) => {
  if (isLetter(event.key)) {
    console.log(event.key);
  }
});

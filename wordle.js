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

let secretWord;
let puzzleNumber;
let currentGuess = "";
let currentRow = 0;

async function generateWord() {
  try {
    // fetch is an async function; returns promise
    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    // .json is async; returns a promise
    const wordleData = await response.json();

    secretWord = wordleData.word;
    puzzleNumber = wordleData.puzzleNumber;

    console.log(`Puzzle number: ${puzzleNumber}\nWord: ${secretWord}`);
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function isValidWord() {
  console.log("validating word: ", currentGuess);
  try {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({
        word: `${currentGuess}`,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    let validationData = await response.json();

    console.log("> ", validationData.validWord);
    return validationData.validWord;
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}
function updateTile() {
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`row-${currentRow}-col-${i}`);
    tile.textContent = currentGuess[i] || "";
  }
}
function submitGuess() {
  if (currentGuess.length < 5) {
    alert("Your guess must be 5 characters long!");
  } else if (isValidWord()) {
    currentRow++;
    currentGuess = "";
    // handle if word is not valid -- maybe move up in logic tree or add "!isValidWord()""
  }
}

function validateGuess() {}

document.addEventListener("keyup", (event) => {
  if (isLetter(event.key)) {
    if (currentGuess.length < 5) {
      currentGuess += event.key;
      console.log("current guess: ", currentGuess);
      updateTile();
    }
  } else if (event.key === "Enter") {
    submitGuess();
    //validateGuess(currentGuess);
  } else if (event.key === "Backspace") {
    currentGuess = currentGuess.slice(0, -1);
    updateTile();
    console.log("current guess: ", currentGuess);
  }
});

function revealWord() {
  document.querySelector(".puzzle-number").innerHTML =
    "Puzzle number: " + puzzleNumber;
  document.querySelector(".secret-word").innerHTML =
    "Word of the day: " + secretWord;
}

generateWord();

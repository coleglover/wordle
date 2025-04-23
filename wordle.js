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
let score = 0;
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
    console.log("> guess count: ", currentRow);
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function isValidWord() {
  console.log("validating guess...", currentGuess);
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

    const validationData = await response.json();
    console.log(validationData);
    return validationData.validWord;
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

function validateGuess() {
  for (let j = 0; j < currentGuess.length; j++) {
    if (currentGuess[j] === secretWord[j]) {
      console.log(`${currentGuess[j]} – correct!`);
      score++;
    } else if (secretWord.includes(currentGuess[j])) {
      console.log(`${currentGuess[j]} - misplaced`);
    } else {
      console.log(`${currentGuess[j]} - absent`);
    }
  }
  if (score === 5) {
    alert("You win!");
  }
  console.log("> score: ", score);
  score = 0;
}

function updateTile() {
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`row-${currentRow}-col-${i}`);
    // set tile to currentGuess[i] if it exists OR set it to ""
    tile.textContent = currentGuess[i] || "";
    //console.log(`current column = ${i}`);
  }
}

async function submitGuess() {
  if (currentGuess.length !== 5) {
    alert("Your guess must be 5 characters long!");
  } else if (!(await isValidWord())) {
    alert("Invalid word. Try again.");
  } else {
    validateGuess();
    currentRow++;
    currentGuess = "";
  }
  console.log("> guess count: ", currentRow);
}

document.addEventListener("keyup", (event) => {
  if (isLetter(event.key)) {
    if (currentGuess.length < 5) {
      currentGuess += event.key;
      console.log("current guess: ", currentGuess);
      updateTile();
    }
  } else if (event.key === "Enter") {
    submitGuess();
  } else if (event.key === "Backspace") {
    currentGuess = currentGuess.slice(0, -1);
    console.log("current guess: ", currentGuess);
    updateTile();
  }
});

function revealWord() {
  document.querySelector(".puzzle-number").innerHTML =
    "Puzzle number: " + puzzleNumber;
  document.querySelector(".secret-word").innerHTML =
    "Word of the day: " + secretWord;
}

generateWord();

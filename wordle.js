// global variables that are commonly accessed
let secretWord;
let puzzleNumber;
let currentGuess = "";
let score = 0;
let currentRow = 0;

// GET request to word of the day endpoint
async function generateWord() {
  try {
    // fetch is an async function; returns promise
    const response = await fetch("https://words.dev-apis.com/word-of-the-day");
    // .json is async; returns a promise
    const wordleData = await response.json();

    // set Wordle uppercase (for comparison)
    secretWord = wordleData.word.toUpperCase();
    puzzleNumber = wordleData.puzzleNumber;

    console.log(`Puzzle number: ${puzzleNumber}\nWord: ${secretWord}`);
    console.log("> guess count: ", currentRow);
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

// algorithm that determines if an input is a letter; returns boolean
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// POST request to word validation endpoint; returns T || F if submission is valid or not
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

    // .json is async; returns a promise
    const validationData = await response.json();
    console.log(validationData);
    return validationData.validWord;
  } catch (error) {
    console.log("Error fetching Wordle data:", error);
  }
}

// triggered by submitGuess();
// + this function determines if letters are "correct", "misplaced", or "absent"
//    - updates styling depending on letter status
// + creates "used" array of [F,F,F,F,F] and updates values to T if guess[i] is "correct"
function validateGuess() {
  const used = Array(currentGuess.length).fill(false);
  for (let i = 0; i < currentGuess.length; i++) {
    if (currentGuess[i] === secretWord[i]) {
      used[i] = "correct";
      score++;
    }
  }

  // + loop over "used" array and determines "misplaced" or "absent" status of remaining letters
  //    - this was required for edge cases with double letters in secret word / guesses
  for (let i = 0; i < currentGuess.length; i++) {
    const tileColour = document.getElementById(`row-${currentRow}-col-${i}`);
    if (used[i] == "correct") {
      console.log(`${currentGuess[i]} – ${used[i]}!`);
      tileColour.style.backgroundColor = "rgb(106, 170, 100)";
      tileColour.style.color = "white";
    } else if (secretWord.includes(currentGuess[i])) {
      //used[i] == true // !!used[i]
      console.log(`${currentGuess[i]} - misplaced`);
      tileColour.style.backgroundColor = "rgb(201, 180, 88)";
      tileColour.style.color = "white";
    } else {
      console.log(`${currentGuess[i]} - absent`);
      tileColour.style.backgroundColor = "rgb(120, 124, 126)";
      tileColour.style.color = "white";
    }
  }
  console.log("> score: ", score);
}

// triggered by "keyUp" eventListener; update tiles as user types
function updateTile() {
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`row-${currentRow}-col-${i}`);
    // set tile to currentGuess[i] if it exists OR set it to ""
    tile.textContent = currentGuess[i] || "";
  }
}

// handle different submission cases from user
async function submitGuess() {
  if (currentGuess.length !== 5) {
    alert("Your guess must be 5 characters long!");
  } else if (!(await isValidWord())) {
    alert("Invalid word. Try again.");
  } else {
    validateGuess();

    // check if user guessed secret word
    if (score === 5 && currentRow > 0) {
      alert(`Congratulations! You won in ${currentRow + 1} guesses.`);
      return;
    } else if (score === 5 && currentRow === 0) {
      alert(`Congratulations! You won in ${currentRow + 1} guess.`);
      return;
    }
    currentRow++;
    currentGuess = "";
    score = 0;
  }
  console.log("> guess count: ", currentRow);
}

// listen to user inputs and parse them accordingly
document.addEventListener("keyup", (event) => {
  if (isLetter(event.key)) {
    if (currentGuess.length < 5) {
      currentGuess += event.key.toUpperCase();
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

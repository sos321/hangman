"use strict";

const words = [
    "mine",
    "raw",
    "stumble",
    "railroad",
    "dealer",
    "space",
    "magnetic",
    "fluctuation",
    "arrest",
    "behavior",
    "funeral",
    "tape",
    "dry",
    "invasion",
    "landscape",
    "seller",
    "bride",
    "common",
    "iron",
    "end",
    "community",
    "depression",
    "gregarious",
    "composer",
    "quit",
    "environmental",
    "chalk",
    "responsible",
    "family",
    "craft",
    "hilarious",
    "motif",
    "fisherman",
    "hurl",
    "commitment",
    "continental",
    "presidency",
    "object",
    "ask",
    "mourning",
    "fear",
    "brand",
    "displace",
    "revolutionary",
    "appoint",
    "blame",
    "representative",
    "directory",
    "nonremittal",
    "self",
];

const colors = new Map();
colors
    .set("win", "#B5CCA7")
    .set("lose", "#EDA8A5")
    .set("correct", "#405C2F")
    .set("incorrect", "#83302C");

const lettersEl = document.querySelectorAll(".guess-letters span");
const endingEL = document.querySelector(".ending-bg");

let secretWord = "";
let state = 0;
let correctGuesses = 0;
let gameEnded = false;

const tries = 11;

// Make restart text rounded
const roundedText = new CircleType(document.querySelector(".ending-bg-text"));
roundedText.radius(150).dir(-1);

// Initialize game
startLetters();
printRandomWord();

document.querySelector(".restart-icon").addEventListener("click", restart);

function resizeBG() {
    // Set a correct background size
    endingEL.style.height = `${document.documentElement.scrollHeight}px`;
}

function startLetters() {
    // Give the letters Event listeners
    lettersEl.forEach(function (letter) {
        letter.addEventListener("click", createClickEvent, { once: true });
    });
}

// Click events
function createClickEvent() {
    evalGuess(this.textContent.toLowerCase());
    this.classList.add("used");
}

function restart() {
    // Reset the game
    state = 0;
    correctGuesses = 0;

    animateBackground();
    document.querySelector(".restart-icon").style.color = "#bababa";
    gameEnded = false;

    startLetters();
    printRandomWord();

    lettersEl.forEach(letter => {
        letter.style.color = "black";
        letter.classList.remove("used");
    });

    document.querySelectorAll(".stroke-edit").forEach(path => {
        path.style.opacity = "0";
        path.style.strokeDashOffset = "300";
        path.style.animation = "none";
    });
}

function printRandomWord() {
    // Get the random word
    secretWord = words[Math.trunc(Math.random() * words.length)];

    // Clean the DOM node
    document.querySelector(".secret-word").innerHTML = "";

    // Print the word
    for (let letter in secretWord) {
        const SpanEl = document.createElement("span");
        SpanEl.textContent = "_";

        document.querySelector(".secret-word").appendChild(SpanEl);
    }
}

function evalGuess(guess) {
    const tempCorrectGuesss = correctGuesses;

    for (let letter in secretWord) {
        if (guess === secretWord[letter]) {
            // Reveal the letter
            document.querySelectorAll(".secret-word span")[letter].textContent =
                guess.toUpperCase();

            lettersEl[guess.charCodeAt(0) - 97].style.color =
                colors.get("correct");

            // Increment the correct guesses
            correctGuesses++;
        }
    }

    // If the correct guesses have not changed, then the guess was incorrect
    if (tempCorrectGuesss === correctGuesses) {
        updateState();

        lettersEl[guess.charCodeAt(0) - 97].style.color =
            colors.get("incorrect");

        document
            .querySelector(".secret-word")
            .classList.add("animation-trigger");

        setTimeout(() => {
            document
                .querySelector(".secret-word")
                .classList.remove("animation-trigger");
        }, 300);
    }

    evalGameState();
}

function evalGameState() {
    // Win condition
    if (correctGuesses === secretWord.length) {
        endGame("win");
    }

    // Lose condition
    if (state === tries) {
        endGame("lose");

        // Print the secret word
        printEntireWord();
    }
}

function printEntireWord() {
    const secretWordEls = document.querySelectorAll(".secret-word span");

    for (let letter in secretWord) {
        if (secretWordEls[letter].textContent === "_") {
            secretWordEls[letter].textContent = secretWord[letter];
            secretWordEls[letter].style.color = colors.get("correct");
        }
    }
}

function updateState() {
    state++;

    document.querySelector(`.stroke-${state}`).style.opacity = "100";
    document.querySelector(`.stroke-${state}`).style.animation =
        "fill 600ms forwards";
}

function endGame(result) {
    resizeBG();

    gameEnded = true;

    // Play ending animation
    document.querySelector(".restart-icon").style.color = "black";
    endingEL.style.backgroundColor = `${colors.get(result)}`;
    animateBackground();
}

function animateBackground() {
    if (gameEnded) {
        if (endingEL.classList.contains("animate-from")) {
            endingEL.classList.remove("animate-from");
            endingEL.classList.add("animate-to");
        } else if (endingEL.classList.contains("animate-to")) {
            endingEL.classList.remove("animate-to");
            endingEL.classList.add("animate-from");
        } else endingEL.classList.add("animate-to");
    }
}

// Handling key presses
document.addEventListener("keydown", function (e) {
    if (e.key.charCodeAt(0) >= 97 && e.key.charCodeAt(0) <= 122) {
        evalGuess(e.key.toLowerCase());
    }
});

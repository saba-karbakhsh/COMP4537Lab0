//All the comments are added by chatGPT

const BUTTON_ELEMENT = "button"; // Represents the button element tag
const CONTAINER_ID = "container"; // ID of the container to hold buttons
const LABEL_ID = "label"; // ID of the label element to display instructions

// Set the label text using userMessages
document.getElementById(LABEL_ID).innerHTML = userMessages.textboxLabel;

// Class representing a Button
class Button {
    static counter = 0; // Tracks the current order of button clicks

    constructor(id, color) {
        this.id = id; // Unique identifier for the button
        this.color = color; // Background color of the button
    }

    createButton() {
        // Create a new button element
        let btn = document.createElement(BUTTON_ELEMENT);
        btn.id = this.id; // Set button's ID
        btn.className = BUTTON_ELEMENT; // Set button's class
        btn.onclick = () => TrackOrder(this.id); // Attach click event handler
        btn.innerHTML = this.id; // Display button ID as its text
        btn.style.backgroundColor = this.color; // Apply the button's color
        document.getElementById(CONTAINER_ID).appendChild(btn); // Add button to container
    }
}

// Class for managing colors
class Color {
    constructor() {
        // Array of available colors
        this.colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    }

    getRandomColor() {
        // Select a random color and remove it from the array to avoid duplicates
        let randomColor = Math.floor(Math.random() * this.colors.length);
        let result = this.colors[randomColor];
        this.colors.splice(randomColor, 1); // Remove the selected color
        return result;
    }
}

let timer; // Timer reference for scrambling process
let isScrambling = false; // State to control scrambling

// Class representing the Game
class Game {
    constructor() {
        // Get user input value from the text box
        this.userInput = parseInt(document.getElementById("input").value, 10);
    }

    async startGame() {
        // Validate user input
        if (!validateInput(this.userInput)) return;

        // Reset game state and clear the container
        ResetGame();
        Button.counter = 0; // Reset button click counter

        // Create buttons based on user input
        createButtons(this.userInput);

        // Disable buttons during scrambling
        disableButtons();

        // Start scrambling process after the specified delay
        await ScrambleButtons(this.userInput);
    }
}

// Attach event listener to the "Go" button to start the game
document.getElementById("button").addEventListener("click", () => {
    let game = new Game();
    game.startGame();
});

// Disable all buttons
function disableButtons() {
    for (let btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.disabled = true; // Disable button
    }
}

// Enable all buttons
function enableButtons() {
    for (let btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.disabled = false; // Enable button
    }
}

// Hide button numbers
function hideNumbers() {
    for (let btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.innerHTML = ""; // Clear button text
    }
}

// Reveal the number on a specific button
function revealNumber(id) {
    document.getElementById(id).innerHTML = id; // Set button text to its ID
}

// Track the order of button clicks
function TrackOrder(id) {
    if (id == Button.counter) {
        // Correct order: reveal the button's number
        revealNumber(id);
        Button.counter++;
    } else {
        // Incorrect order: show an error message
        alert(userMessages.wrongOrder);
    }

    // Check if all buttons have been clicked in the correct order
    if (Button.counter == document.getElementsByClassName(BUTTON_ELEMENT).length) {
        alert(userMessages.winningMessage); // Show success message
        Button.counter = 0; // Reset counter
        disableButtons(); // Disable buttons
    }
}

// Validate user input
function validateInput(userInput) {
    if (!(userInput >= 3 && userInput <= 7)) {
        // Input is invalid: show an error message
        alert(userMessages.invalidInput);
        return false;
    }
    return true;
}

// Reset the game state
function ResetGame() {
    clearTimeout(timer); // Clear any active timers
    isScrambling = false; // Reset scrambling state
    document.getElementById(CONTAINER_ID).innerHTML = ""; // Clear container
    enableButtons(); // Enable buttons
}

// Create buttons with random colors
function createButtons(userInput) {
    let color = new Color(); // Create a Color object
    for (let i = 0; i < userInput; i++) {
        let button = new Button(i, color.getRandomColor()); // Create a Button object
        button.createButton(); // Add the button to the container
    }
}

// Scramble buttons by moving them to random positions
async function ScrambleButtons(userInput) {
    hideNumbers(); // Hide button numbers
    isScrambling = true; // Set scrambling state

    for (let i = 0; i < userInput; i++) {
        for (let btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
            // Get window dimensions
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate maximum positions to keep buttons visible
            const maxLeft = windowWidth - btn.offsetWidth;
            const maxTop = windowHeight - btn.offsetHeight;

            // Generate random positions within bounds
            const randLeft = Math.random() * maxLeft;
            const randTop = Math.random() * maxTop;

            // Apply new positions
            btn.style.position = "absolute";
            btn.style.left = `${randLeft}px`;
            btn.style.top = `${randTop}px`;
        }

        // Wait for 2 seconds before scrambling again
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    isScrambling = false; // End scrambling
    enableButtons(); // Enable buttons for user interaction
}

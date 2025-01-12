//All the comments are added by ChatGPT
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
        const btn = document.createElement("button");
        btn.id = `btn-${this.id}`; // Set unique button ID
        btn.className = BUTTON_ELEMENT; // Set button's class
        btn.onclick = () => TrackOrder(this.id); // Attach click event handler
        btn.innerHTML = this.id; // Display button ID as its text
        btn.style.backgroundColor = this.color; // Apply the button's color
        btn.style.height = "5em"; // Set button height
        btn.style.width = "10em"; // Set button width
        btn.style.margin = "0.5em"; // Set button margin
        document.getElementById(CONTAINER_ID).appendChild(btn); // Add button to container
    }
}

// Class for managing colors
class Color {
    constructor() {
        this.colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"]; // Array of available colors
    }

    getRandomColor() {
        // Select a random color and remove it from the array to avoid duplicates
        const randomIndex = Math.floor(Math.random() * this.colors.length);
        return this.colors.splice(randomIndex, 1)[0];
    }
}

let timer; // Timer reference for scrambling process
let isScrambling = false; // State to control scrambling
let scrambleId = 0; // Unique ID for each game to control scrambling

// Class representing the Game
class Game {
    constructor() {
        this.userInput = parseInt(document.getElementById("input").value, 10); // Get user input value
    }

    async startGame() {
        // Validate user input
        if (!validateInput(this.userInput)) return;

        // Cancel any existing game timers and reset the state
        ResetGame();

        // Create a new unique ID for this game's scrambling process
        const currentScrambleId = ++scrambleId;

        // Create buttons for the game
        createButtons(this.userInput);

        // Start scrambling after the specified delay
        timer = setTimeout(async () => {
            hideNumbers();
            isScrambling = true; // Set scrambling state
            await scrambleButtons(this.userInput, currentScrambleId); // Call the scramble function
        }, this.userInput * 1000);
    }
}

// Scramble buttons by moving them to random positions
async function scrambleButtons(userInput, currentScrambleId) {
    hideNumbers(); // Hide button numbers
    isScrambling = true; // Set scrambling state

    for (let i = 0; i < userInput; i++) {
        // Stop scrambling if a new game starts or reset is triggered
        if (currentScrambleId !== scrambleId) break;

        for (const btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
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

        await sleep(2000); // Pause for 2 seconds before the next scramble
    }

    if (currentScrambleId === scrambleId) {
        isScrambling = false; // End scrambling
        enableButtons(); // Enable buttons for user interaction
    }
}

// Attach event listener to the "Go" button to start the game
document.getElementById("button").addEventListener("click", () => {
    const game = new Game();
    game.startGame();
});

// Disable all buttons
function disableButtons() {
    for (const btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.disabled = true; // Disable button
    }
}

// Enable all buttons
function enableButtons() {
    for (const btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.disabled = false; // Enable button
    }
}

// Hide button numbers
function hideNumbers() {
    for (const btn of document.getElementsByClassName(BUTTON_ELEMENT)) {
        btn.innerHTML = ""; // Clear button text
    }
}

// Reveal the number on a specific button
function revealNumber(id) {
    document.getElementById(`btn-${id}`).innerHTML = id; // Set button text to its ID
}

// Track the order of button clicks
function TrackOrder(id) {
    if (id === Button.counter) {
        // Correct order: reveal the button's number
        revealNumber(id);
        Button.counter++;
    } else {
        // Incorrect order: show an error message
        alert(userMessages.wrongOrder);
    }

    // Check if all buttons have been clicked in the correct order
    if (Button.counter === document.getElementsByClassName(BUTTON_ELEMENT).length) {
        alert(userMessages.winningMessage); // Show success message
        disableButtons(); // Disable buttons to prevent further interaction
    }
}

// Validate user input
function validateInput(userInput) {
    if (isNaN(userInput) || userInput < 3 || userInput > 7) {
        alert(userMessages.invalidInput); // Show error message
        return false;
    }
    return true;
}

// Reset the game state
function ResetGame() {
    disableButtons(); // Disable buttons to prevent interaction
    clearTimeout(timer); // Clear the scrambling timer
    isScrambling = false; // Stop scrambling
    document.getElementById(CONTAINER_ID).innerHTML = ""; // Clear all buttons in the container
    Button.counter = 0; // Reset button click counter
}

// Create buttons with random colors
function createButtons(userInput) {
    const color = new Color();
    for (let i = 0; i < userInput; i++) {
        const button = new Button(i, color.getRandomColor());
        button.createButton(); // Add the button to the container
    }
    disableButtons(); // Disable buttons initially
}

// Sleep function to wait for a specified amount of milliseconds
function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

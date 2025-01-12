const BUTTON_CLASS = "button";
const CONTAINER_ID = "container";

document.getElementById("label").innerHTML = userMessages.textboxLabel;

class Button {
    static counter = 0;

    constructor(id, color) {
        this.id = id;
        this.color = color;
    }

    createButton() {
        let btn = document.createElement(BUTTON_CLASS);
        btn.id = this.id;
        btn.className = BUTTON_CLASS;
        btn.onclick = function () {
            let id = this.id;
            if (id == Button.counter) {
                revealNumber(id);
                Button.counter++;
            } else {
                alert(userMessages.wrongOrder);
            }
            if (Button.counter == document.getElementsByClassName("button").length) {
                alert(userMessages.winningMessage);
                Button.counter = 0;
                disableButtons();
            }
        };
        btn.innerHTML = this.id;
        btn.style.backgroundColor = this.color;
        btn.style.height = "5em";
        btn.style.width = "10em";
        btn.style.margin = "0.5em";
        document.getElementById(CONTAINER_ID).appendChild(btn);
    }
}

class Color {
    constructor() {
        this.colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    }

    getRandomColor() {
        let randomColor = Math.floor(Math.random() * this.colors.length);
        let result = this.colors[randomColor];
        this.colors.splice(randomColor, 1);
        return result;
    }
}

let timer;
let isScrambling = false; // State to control scrambling

class Game {
    constructor() {
        this.userInput = parseInt(document.getElementById("input").value, 10);
    }

    async startGame() {
        // Validate user input
        if (!(this.userInput >= 3 && this.userInput <= 7)) {
            alert(userMessages.invalidInput);
            return;
        }
        
    

        // Cancel any existing game timers and scrambling
        clearTimeout(timer);
        isScrambling = false;

        // Reset the container and game state
        document.getElementById(CONTAINER_ID).innerHTML = "";
        Button.counter = 0;

        // Create buttons
        let color = new Color();
        for (let i = 0; i < this.userInput; i++) {
            let randomColor = color.getRandomColor();
            let button = new Button(i, randomColor);
            button.createButton();
        }

        disableButtons(); 
        // Start the scrambling process after userInput seconds
        timer = setTimeout(async () => {
            hideNumbers();
            isScrambling = true; // Set scrambling state
            for (let i = 0; i < this.userInput; i++) {
                for (let j = 0; j < this.userInput; j++) {
                    if (!isScrambling) break; // Stop scrambling if the game restarts
            
                    // Get window dimensions
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
            
                    // Calculate maximum positions to keep buttons fully visible
                    const maxLeft = windowWidth - document.getElementById(j).offsetWidth; // Width of button
                    const maxTop = windowHeight - document.getElementById(j).offsetHeight; // Height of button
            
                    // Generate random positions within the allowed range
                    const randLeft = Math.random() * maxLeft;
                    const randTop = Math.random() * maxTop;
            
                    // Apply random positions
                    const btn = document.getElementById(j);
                    btn.style.position = "absolute";
                    btn.style.left = `${randLeft}px`; // Use pixels for precise positioning
                    btn.style.top = `${randTop}px`;
                }
                await this.sleep(2000); // Wait for 2 seconds before scrambling the next button
            }
            
            isScrambling = false; // End scrambling
            enableButtons();
        }, this.userInput * 1000);
    }

    
    sleep(milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }
}

document.getElementById(BUTTON_CLASS).addEventListener("click", () => {
    let game = new Game();
    game.startGame();

});


function disableButtons() {
    for (let i = 0; i < document.getElementsByClassName(BUTTON_CLASS).length; i++) {
        document.getElementById(i).disabled = true;
    }

}

function enableButtons() {
    for (let i = 0; i < document.getElementsByClassName(BUTTON_CLASS).length; i++) {
        document.getElementById(i).removeAttribute("disabled");
    }
}

function hideNumbers() {
    for (let i = 0; i < document.getElementsByClassName(BUTTON_CLASS).length; i++) {
        document.getElementById(i).innerHTML = "";
    }
}

function revealNumber(id) {
    document.getElementById(id).innerHTML = id;
}
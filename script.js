document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level');
    const statusDisplay = document.getElementById('status');
    const startBtn = document.getElementById('start-btn');

    // --- Game Configuration ---
    const cardCount = 6;
    const cardEmojis = ['💀', '🎃', '👻', '🌶️', '🌮', '🌵'];
    const glowColors = ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71', '#e67e22'];
    const sequenceLength = 5; // Each level will have a sequence of this length

    // --- Game State Variables ---
    let sequence = [];
    let playerSequence = [];
    let level = 1;
    let canPlayerClick = false;

    // --- Functions ---

    /**
     * Creates the card elements and appends them to the game board.
     */
    function createGameBoard() {
        gameBoard.innerHTML = ''; // Clear previous board
        for (let i = 0; i < cardCount; i++) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = i;
            card.innerHTML = cardEmojis[i];
            card.style.setProperty('--glow-color', glowColors[i]);
            card.addEventListener('click', handleCardClick);
            gameBoard.appendChild(card);
        }
    }

    /**
     * Starts a new game or the next level.
     */
    function nextLevel() {
        levelDisplay.textContent = level;
        playerSequence = [];
        canPlayerClick = false;
        statusDisplay.textContent = 'Watch the sequence...';
        startBtn.disabled = true;

        sequence = [];
        for (let i = 0; i < sequenceLength; i++) {
            const nextStep = Math.floor(Math.random() * cardCount);
            sequence.push(nextStep);
        }

        playSequence();
    }

    /**
     * Animates the sequence of cards for the player to memorize.
     */
    function playSequence() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= sequence.length) {
                clearInterval(interval);
                canPlayerClick = true;
                statusDisplay.textContent = 'Your turn!';
                return;
            }
            const cardIndex = sequence[i];
            const card = document.querySelector(`.card[data-id='${cardIndex}']`);
            if (card) {
                card.classList.add('active');
                setTimeout(() => {
                    card.classList.remove('active');
                }, 600);
            }
            i++;
        }, 1000);
    }

    /**
     * Handles the player's click on a card.
     * @param {Event} event - The click event.
     */
    function handleCardClick(event) {
        if (!canPlayerClick) return;

        const clickedCard = event.currentTarget;
        const clickedCardId = parseInt(clickedCard.dataset.id);
        
        // --- AMENDED LOGIC ---
        // Immediately add the glow, and ensure it's removed after a short delay.
        clickedCard.classList.add('active');
        setTimeout(() => {
            clickedCard.classList.remove('active');
        }, 300);
        // --- END AMENDED LOGIC ---

        playerSequence.push(clickedCardId);
        checkPlayerInput();
    }

    /**
     * Checks the player's input against the correct sequence.
     */
    function checkPlayerInput() {
        const currentStepIndex = playerSequence.length - 1;

        if (playerSequence[currentStepIndex] !== sequence[currentStepIndex]) {
            // Use a timeout to allow the final incorrect glow to fade
            setTimeout(gameOver, 300); 
            return;
        }

        if (playerSequence.length === sequence.length) {
            statusDisplay.textContent = 'Correct! Next level...';
            level++;
            canPlayerClick = false; // Prevent clicks while transitioning
            setTimeout(nextLevel, 1500);
        }
    }

    /**
     * Resets the game state and notifies the player of game over.
     */
    function gameOver() {
        statusDisplay.textContent = `Game Over! You reached level ${level}.`;
        canPlayerClick = false;

        // This is a fallback, but the primary fix is in handleCardClick
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => card.classList.remove('active'));

        startBtn.disabled = false;
        startBtn.textContent = 'Play Again?';
        level = 1;
        sequence = [];
    }

    /**
     * Initializes the game when the start button is clicked.
     */
    function startGame() {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => card.classList.remove('active'));

        startBtn.textContent = 'Start Game';
        level = 1;
        sequence = [];
        nextLevel();
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startGame);

    // --- Initial Setup ---
    createGameBoard();
});

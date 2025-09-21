document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('sudoku-board');
    const timerElement = document.getElementById('timer');
    const difficultyElement = document.getElementById('difficulty');
    const statusElement = document.getElementById('status');
    const scoreElement = document.getElementById('score');
    const numberButtons = document.querySelectorAll('.number-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const newGameBtn = document.querySelector('.btn-new-game');
    const checkBtn = document.querySelector('.btn-check');
    const solveBtn = document.querySelector('.btn-solve');
    const clearBtn = document.querySelector('.btn-clear');
    const notesBtn = document.querySelector('.btn-notes');
    const eraseBtn = document.getElementById('btn-erase');
    
    // Stats elements
    const gamesPlayedElement = document.getElementById('games-played');
    const winRateElement = document.getElementById('win-rate');
    const avgTimeElement = document.getElementById('avg-time');
    const hintsUsedElement = document.getElementById('hints-used');
    
    let selectedCell = null;
    let startTime = null;
    let timerInterval = null;
    let boardData = [];
    let solution = [];
    let difficulty = 'medium';
    let notesMode = false;
    let score = 0;
    let hintsUsed = 0;
    let gamesPlayed = 0;
    let gamesWon = 0;
    let totalTime = 0;
    
    // Initialize the board
    initializeBoard();
    
    // Generate a new puzzle
    generatePuzzle();
    
    // Start the timer
    startTimer();
    
    // Initialize the board with cells
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => selectCell(cell));
            board.appendChild(cell);
        }
    }
    
    // Generate a new puzzle based on difficulty
    function generatePuzzle() {
        // Sample puzzles for each difficulty level
        const puzzles = {
            easy: [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            medium: [
                [0, 2, 0, 6, 0, 8, 0, 0, 0],
                [5, 8, 0, 0, 0, 9, 7, 0, 0],
                [0, 0, 0, 0, 4, 0, 0, 0, 0],
                [3, 7, 0, 0, 0, 0, 5, 0, 0],
                [6, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 8, 0, 0, 0, 0, 1, 3],
                [0, 0, 0, 0, 2, 0, 0, 0, 0],
                [0, 0, 9, 8, 0, 0, 0, 3, 6],
                [0, 0, 0, 3, 0, 6, 0, 9, 0]
            ],
            hard: [
                [0, 0, 0, 6, 0, 0, 4, 0, 0],
                [7, 0, 0, 0, 0, 3, 6, 0, 0],
                [0, 0, 0, 0, 9, 1, 0, 8, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 5, 0, 1, 8, 0, 0, 0, 3],
                [0, 0, 0, 3, 0, 6, 0, 4, 5],
                [0, 4, 0, 2, 0, 0, 0, 6, 0],
                [9, 0, 3, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 0, 1, 0, 0]
            ],
            expert: [
                [0, 2, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 6, 0, 0, 0, 0, 3],
                [0, 7, 4, 0, 8, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 3, 0, 0, 2],
                [0, 8, 0, 0, 4, 0, 0, 1, 0],
                [6, 0, 0, 5, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 7, 8, 0],
                [5, 0, 0, 0, 0, 9, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 0]
            ]
        };
        
        // Solutions for each puzzle
        const solutions = {
            easy: [
                [5, 3, 4, 6, 7, 8, 9, 1, 2],
                [6, 7, 2, 1, 9, 5, 3, 4, 8],
                [1, 9, 8, 3, 4, 2, 5, 6, 7],
                [8, 5, 9, 7, 6, 1, 4, 2, 3],
                [4, 2, 6, 8, 5, 3, 7, 9, 1],
                [7, 1, 3, 9, 2, 4, 8, 5, 6],
                [9, 6, 1, 5, 3, 7, 2, 8, 4],
                [2, 8, 7, 4, 1, 9, 6, 3, 5],
                [3, 4, 5, 2, 8, 6, 1, 7, 9]
            ],
            medium: [
                [1, 2, 3, 6, 7, 8, 9, 4, 5],
                [5, 8, 4, 2, 3, 9, 7, 6, 1],
                [9, 6, 7, 1, 4, 5, 3, 2, 8],
                [3, 7, 2, 4, 6, 1, 5, 8, 9],
                [6, 9, 1, 5, 8, 3, 2, 7, 4],
                [4, 5, 8, 7, 9, 2, 6, 1, 3],
                [8, 3, 6, 9, 2, 4, 1, 5, 7],
                [2, 1, 9, 8, 5, 7, 4, 3, 6],
                [7, 4, 5, 3, 1, 6, 8, 9, 2]
            ],
            hard: [
                [5, 8, 1, 6, 7, 2, 4, 3, 9],
                [7, 9, 2, 8, 4, 3, 6, 5, 1],
                [3, 6, 4, 5, 9, 1, 7, 8, 2],
                [4, 3, 8, 9, 5, 7, 2, 1, 6],
                [2, 5, 6, 1, 8, 4, 9, 7, 3],
                [1, 7, 9, 3, 2, 6, 8, 4, 5],
                [8, 4, 5, 2, 1, 9, 3, 6, 7],
                [9, 1, 3, 7, 6, 8, 5, 2, 4],
                [6, 2, 7, 4, 3, 5, 1, 9, 8]
            ],
            expert: [
                [1, 2, 6, 4, 3, 7, 9, 5, 8],
                [8, 9, 5, 6, 2, 1, 4, 7, 3],
                [3, 7, 4, 9, 8, 5, 1, 2, 6],
                [4, 5, 7, 1, 9, 3, 8, 6, 2],
                [9, 8, 3, 2, 4, 6, 5, 1, 7],
                [6, 1, 2, 5, 7, 8, 3, 9, 4],
                [2, 6, 9, 3, 1, 4, 7, 8, 5],
                [5, 4, 8, 7, 6, 9, 2, 3, 1],
                [7, 3, 1, 8, 5, 2, 6, 4, 9]
            ]
        };
        
        boardData = JSON.parse(JSON.stringify(puzzles[difficulty]));
        solution = JSON.parse(JSON.stringify(solutions[difficulty]));
        updateBoard();
        
        // Update difficulty display
        difficultyElement.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        
        // Update status
        statusElement.textContent = `New ${difficulty} puzzle generated!`;
        statusElement.style.color = "#2c3e50";
    }
    
    // Update the board display
    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            const value = boardData[row][col];
            
            cells[i].textContent = value === 0 ? '' : value;
            
            // Remove all classes
            cells[i].className = 'cell';
            
            // Add appropriate classes
            if (value !== 0) {
                cells[i].classList.add('fixed');
            }
            
            // Remove candidate view
            cells[i].classList.remove('candidate');
        }
    }
    
    // Select a cell
    function selectCell(cell) {
        // Deselect previously selected cell
        if (selectedCell) {
            selectedCell.classList.remove('selected');
            
            // Also remove highlighted from related cells
            const cells = document.querySelectorAll('.cell');
            cells.forEach(c => c.classList.remove('highlighted'));
        }
        
        // Select new cell if it's not fixed
        if (!cell.classList.contains('fixed')) {
            cell.classList.add('selected');
            selectedCell = cell;
            
            // Highlight related cells (same row, column, and box)
            highlightRelatedCells(cell);
        } else {
            selectedCell = null;
        }
    }
    
    // Highlight related cells
    function highlightRelatedCells(cell) {
        const index = parseInt(cell.dataset.index);
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        const cells = document.querySelectorAll('.cell');
        
        for (let i = 0; i < 81; i++) {
            const r = Math.floor(i / 9);
            const c = i % 9;
            
            // Same row, column, or 3x3 box
            if (r === row || c === col || (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3))) {
                cells[i].classList.add('highlighted');
            }
        }
    }
    
    // Input a number into the selected cell
    function inputNumber(number) {
        if (selectedCell && !selectedCell.classList.contains('fixed')) {
            const index = parseInt(selectedCell.dataset.index);
            const row = Math.floor(index / 9);
            const col = index % 9;
            
            // Update board data
            boardData[row][col] = number;
            
            // Update display
            selectedCell.textContent = number === 0 ? '' : number;
            
            // Add correct animation if the number is right
            if (number !== 0 && number === solution[row][col]) {
                selectedCell.classList.add('correct');
                setTimeout(() => {
                    selectedCell.classList.remove('correct');
                }, 500);
                
                // Increase score
                score += 10;
                scoreElement.textContent = score;
            } else if (number !== 0 && number !== solution[row][col]) {
                selectedCell.classList.add('error');
                setTimeout(() => {
                    selectedCell.classList.remove('error');
                }, 500);
                
                // Decrease score
                score = Math.max(0, score - 5);
                scoreElement.textContent = score;
            }
            
            // Check if the puzzle is solved
            if (isSolved()) {
                clearInterval(timerInterval);
                statusElement.textContent = "Congratulations! You solved the puzzle!";
                statusElement.style.color = "#27ae60";
                
                // Update stats
                gamesPlayed++;
                gamesWon++;
                updateStats();
            }
        }
    }
    
    // Check if the board is solved
    function isSolved() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (boardData[row][col] !== solution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Check for errors in the board
    function checkSolution() {
        let hasErrors = false;
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (boardData[row][col] !== 0 && boardData[row][col] !== solution[row][col]) {
                    hasErrors = true;
                    const index = row * 9 + col;
                    const cell = document.querySelector(`.cell[data-index="${index}"]`);
                    cell.classList.add('error');
                }
            }
        }
        
        if (hasErrors) {
            statusElement.textContent = "There are errors in your solution.";
            statusElement.style.color = "#e74c3c";
        } else {
            statusElement.textContent = "Your solution is correct so far!";
            statusElement.style.color = "#27ae60";
        }
    }
    
    // Solve one step (hint)
    function solveStep() {
        if (!selectedCell) {
            statusElement.textContent = "Please select a cell first.";
            statusElement.style.color = "#e74c3c";
            return;
        }
        
        const index = parseInt(selectedCell.dataset.index);
        const row = Math.floor(index / 9);
        const col = index % 9;
        
        if (boardData[row][col] !== 0) {
            statusElement.textContent = "This cell already has a value.";
            statusElement.style.color = "#e74c3c";
            return;
        }
        
        boardData[row][col] = solution[row][col];
        selectedCell.textContent = solution[row][col];
        selectedCell.classList.add('correct');
        
        setTimeout(() => {
            selectedCell.classList.remove('correct');
        }, 500);
        
        // Update hints used
        hintsUsed++;
        hintsUsedElement.textContent = hintsUsed;
        
        // Decrease score for using hint
        score = Math.max(0, score - 20);
        scoreElement.textContent = score;
        
        statusElement.textContent = "Hint applied!";
        statusElement.style.color = "#3498db";
        
        // Check if the puzzle is solved
        if (isSolved()) {
            clearInterval(timerInterval);
            statusElement.textContent = "Congratulations! You solved the puzzle!";
            statusElement.style.color = "#27ae60";
            
            // Update stats
            gamesPlayed++;
            gamesWon++;
            updateStats();
        }
    }
    
    // Clear the board
    function clearBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                // Only clear non-fixed cells
                const index = row * 9 + col;
                const cell = document.querySelector(`.cell[data-index="${index}"]`);
                
                if (!cell.classList.contains('fixed')) {
                    boardData[row][col] = 0;
                    cell.textContent = '';
                    cell.classList.remove('error');
                }
            }
        }
        
        statusElement.textContent = "Board cleared!";
        statusElement.style.color = "#3498db";
        
        // Reset score
        score = 0;
        scoreElement.textContent = score;
    }
    
    // Start the timer
    function startTimer() {
        startTime = new Date();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Update the timer display
    function updateTimer() {
        const now = new Date();
        const elapsed = new Date(now - startTime);
        
        const minutes = elapsed.getUTCMinutes().toString().padStart(2, '0');
        const seconds = elapsed.getUTCSeconds().toString().padStart(2, '0');
        
        timerElement.textContent = `${minutes}:${seconds}`;
    }
    
    // Update game statistics
    function updateStats() {
        gamesPlayedElement.textContent = gamesPlayed;
        winRateElement.textContent = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) + '%' : '0%';
        
        // Calculate average time (simplified)
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        totalTime += elapsed;
        
        const avgTime = gamesPlayed > 0 ? Math.floor(totalTime / gamesPlayed) : 0;
        const avgMinutes = Math.floor(avgTime / 60).toString().padStart(2, '0');
        const avgSeconds = (avgTime % 60).toString().padStart(2, '0');
        
        avgTimeElement.textContent = `${avgMinutes}:${avgSeconds}`;
        hintsUsedElement.textContent = hintsUsed;
    }
    
    // Event listeners for number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.id === 'btn-erase') {
                inputNumber(0);
            } else {
                const number = parseInt(this.dataset.number);
                inputNumber(number);
            }
        });
    });
    
    // Event listeners for difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set difficulty
            difficulty = this.classList[1];
            
            // Generate new puzzle
            clearInterval(timerInterval);
            generatePuzzle();
            startTimer();
            
            // Reset score
            score = 0;
            scoreElement.textContent = score;
        });
    });
    
    // Event listener for New Game button
    newGameBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        generatePuzzle();
        startTimer();
        
        // Reset score
        score = 0;
        scoreElement.textContent = score;
        
        statusElement.textContent = "New game started!";
        statusElement.style.color = "#3498db";
    });
    
    // Event listener for Check Solution button
    checkBtn.addEventListener('click', checkSolution);
    
    // Event listener for Solve Step button
    solveBtn.addEventListener('click', solveStep);
    
    // Event listener for Clear All button
    clearBtn.addEventListener('click', clearBoard);
    
    // Event listener for Notes button
    notesBtn.addEventListener('click', function() {
        notesMode = !notesMode;
        this.classList.toggle('active');
        
        if (notesMode) {
            statusElement.textContent = "Notes mode enabled";
            statusElement.style.color = "#9b59b6";
        } else {
            statusElement.textContent = "Notes mode disabled";
            statusElement.style.color = "#3498db";
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(event) {
        if (selectedCell) {
            if (event.key >= '1' && event.key <= '9') {
                inputNumber(parseInt(event.key));
            } else if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
                inputNumber(0);
            }
        }
    });
    
    // Initialize stats
    gamesPlayedElement.textContent = gamesPlayed;
    winRateElement.textContent = winRateElement.textContent = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) + '%' : '0%';
    avgTimeElement.textContent = "00:00";
    hintsUsedElement.textContent = hintsUsed;
});
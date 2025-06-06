document.addEventListener('DOMContentLoaded', function() {
    // Animation for the loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    const brandingAnimation = document.getElementById('brandingAnimation');
    const branding = document.getElementById('branding');
    const gameContainer = document.getElementById('gameContainer');
    const copyright = document.getElementById('copyright');
    
    const companyName = "shanecore_systems™";
    let currentChar = 0;
    
    function typeWriter() {
        if (currentChar < companyName.length) {
            brandingAnimation.textContent += companyName.charAt(currentChar);
            currentChar++;
            setTimeout(typeWriter, 100); // Adjust typing speed here
        } else {
            // When animation completes
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    branding.style.opacity = '1';
                    branding.style.transform = 'translateY(0)';
                    gameContainer.style.opacity = '1';
                    gameContainer.style.transform = 'translateY(0)';
                    copyright.style.opacity = '1';
                }, 1000);
            }, 1000);
        }
    }
    
    // Start the typing animation
    setTimeout(typeWriter, 500);
    
    // Rest of the chess game code
    const board = document.getElementById('chessboard');
    const whiteTimer = document.getElementById('white-timer');
    const blackTimer = document.getElementById('black-timer');
    const whiteTimerDisplay = whiteTimer.querySelector('.timer-display');
    const blackTimerDisplay = blackTimer.querySelector('.timer-display');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const gameInfo = document.getElementById('game-info');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    let selectedPiece = null;
    let currentPlayer = 'white'; // White always starts first
    let whiteTime = 600;
    let blackTime = 600;
    let timerInterval = null;
    let gameActive = false;
    let gameMode = 'local';
    let computerThinking = false;
    
    // Initialize board
    initBoard();
    
    // Mode selection
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (gameActive) {
                gameInfo.textContent = "Finish current game before changing mode";
                return;
            }
            
            modeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameMode = this.dataset.mode;
            
            if (gameMode === 'online') {
                gameInfo.textContent = "Online multiplayer coming soon!";
            } else {
                gameInfo.textContent = `Mode: ${this.textContent}. Press START`;
            }
        });
    });
    
    // Game functions
    function initBoard() {
        board.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                board.appendChild(square);
            }
        }
        
        setupPieces();
    }
    
    function setupPieces() {
        const pieces = [
            // White pieces (using black symbols but styled white)
            { type: '♜', row: 0, col: 0, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♞', row: 0, col: 1, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♝', row: 0, col: 2, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♛', row: 0, col: 3, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♚', row: 0, col: 4, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♝', row: 0, col: 5, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♞', row: 0, col: 6, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♜', row: 0, col: 7, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 0, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 1, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 2, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 3, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 4, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 5, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 6, color: 'white', hasMoved: false, class: 'white-piece' },
            { type: '♟', row: 1, col: 7, color: 'white', hasMoved: false, class: 'white-piece' },
            
            // Black pieces (using white symbols but styled black)
            { type: '♖', row: 7, col: 0, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♘', row: 7, col: 1, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♗', row: 7, col: 2, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♕', row: 7, col: 3, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♔', row: 7, col: 4, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♗', row: 7, col: 5, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♘', row: 7, col: 6, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♖', row: 7, col: 7, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 0, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 1, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 2, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 3, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 4, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 5, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 6, color: 'black', hasMoved: false, class: 'black-piece' },
            { type: '♙', row: 6, col: 7, color: 'black', hasMoved: false, class: 'black-piece' }
        ];
        
        pieces.forEach(piece => {
            const square = getSquare(piece.row, piece.col);
            if (square) {
                const pieceElement = document.createElement('span');
                pieceElement.className = piece.class;
                pieceElement.textContent = piece.type;
                square.appendChild(pieceElement);
                square.dataset.piece = piece.type;
                square.dataset.color = piece.color;
                square.dataset.hasMoved = 'false';
            }
        });
    }
    
    function getSquare(row, col) {
        return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    function updateTimers() {
        whiteTimerDisplay.textContent = formatTime(whiteTime);
        blackTimerDisplay.textContent = formatTime(blackTime);
    }
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        
        gameActive = true;
        startBtn.textContent = 'PAUSE';
        gameInfo.textContent = `Playing: ${document.querySelector('.mode-btn.active').textContent}`;
        
        // White always starts first
        currentPlayer = 'white';
        whiteTimer.classList.add('active');
        blackTimer.classList.remove('active');
        
        timerInterval = setInterval(() => {
            if (currentPlayer === 'white') {
                whiteTime--;
                if (whiteTime <= 0) {
                    endGame('Black wins on time!');
                    return;
                }
            } else {
                blackTime--;
                if (blackTime <= 0) {
                    endGame('White wins on time!');
                    return;
                }
            }
            updateTimers();
        }, 1000);
        
        // If playing against computer and black starts (shouldn't happen as white always starts)
        if (gameMode === 'computer' && currentPlayer === 'black') {
            computerMove();
        }
    }
    
    function pauseGame() {
        gameActive = false;
        if (timerInterval) clearInterval(timerInterval);
        startBtn.textContent = 'RESUME';
        whiteTimer.classList.remove('active');
        blackTimer.classList.remove('active');
        gameInfo.textContent = "Game paused";
    }
    
    function endGame(message) {
        pauseGame();
        gameInfo.textContent = message;
    }
    
    function resetGame() {
        pauseGame();
        selectedPiece = null;
        currentPlayer = 'white'; // Reset to white's turn
        whiteTime = 600;
        blackTime = 600;
        updateTimers();
        initBoard();
        startBtn.textContent = 'START';
        document.querySelectorAll('.square').forEach(sq => {
            sq.classList.remove('highlight');
            // Remove any move indicators
            const indicators = sq.querySelectorAll('.possible-move, .capture-move');
            indicators.forEach(ind => ind.remove());
        });
        gameInfo.textContent = `Mode: ${document.querySelector('.mode-btn.active').textContent}. Press START`;
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        whiteTimer.classList.toggle('active');
        blackTimer.classList.toggle('active');
        
        // If playing against computer and it's computer's turn
        if (gameMode === 'computer' && currentPlayer === 'black' && gameActive) {
            computerMove();
        }
    }
    
    function getPossibleMoves(pieceElement) {
        const row = parseInt(pieceElement.dataset.row);
        const col = parseInt(pieceElement.dataset.col);
        const pieceType = pieceElement.dataset.piece;
        const color = pieceElement.dataset.color;
        const hasMoved = pieceElement.dataset.hasMoved === 'true';
        const moves = [];
        
        // Helper function to add moves in a direction
        const addDirectionalMoves = (rowDelta, colDelta, maxSteps = 7) => {
            for (let step = 1; step <= maxSteps; step++) {
                const newRow = row + (rowDelta * step);
                const newCol = col + (colDelta * step);
                if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
                
                const targetSquare = getSquare(newRow, newCol);
                if (!targetSquare) break;
                
                if (!targetSquare.dataset.piece) {
                    moves.push({ square: targetSquare, isCapture: false });
                } else {
                    if (targetSquare.dataset.color !== color) {
                        moves.push({ square: targetSquare, isCapture: true });
                    }
                    break;
                }
            }
        };
        
        switch (pieceType) {
            case '♙': // Black pawn
                // Move forward
                if (row > 0) {
                    const forward = getSquare(row - 1, col);
                    if (forward && !forward.dataset.piece) {
                        moves.push({ square: forward, isCapture: false });
                        
                        // Double move from starting position
                        if (row === 6) {
                            const doubleForward = getSquare(row - 2, col);
                            if (doubleForward && !doubleForward.dataset.piece) {
                                moves.push({ square: doubleForward, isCapture: false });
                            }
                        }
                    }
                }
                
                // Captures
                if (row > 0 && col > 0) {
                    const leftDiag = getSquare(row - 1, col - 1);
                    if (leftDiag && leftDiag.dataset.piece && leftDiag.dataset.color !== color) {
                        moves.push({ square: leftDiag, isCapture: true });
                    }
                }
                
                if (row > 0 && col < 7) {
                    const rightDiag = getSquare(row - 1, col + 1);
                    if (rightDiag && rightDiag.dataset.piece && rightDiag.dataset.color !== color) {
                        moves.push({ square: rightDiag, isCapture: true });
                    }
                }
                break;
                
            case '♟': // White pawn
                // Move forward
                if (row < 7) {
                    const forward = getSquare(row + 1, col);
                    if (forward && !forward.dataset.piece) {
                        moves.push({ square: forward, isCapture: false });
                        
                        // Double move from starting position
                        if (row === 1) {
                            const doubleForward = getSquare(row + 2, col);
                            if (doubleForward && !doubleForward.dataset.piece) {
                                moves.push({ square: doubleForward, isCapture: false });
                            }
                        }
                    }
                }
                
                // Captures
                if (row < 7 && col > 0) {
                    const leftDiag = getSquare(row + 1, col - 1);
                    if (leftDiag && leftDiag.dataset.piece && leftDiag.dataset.color !== color) {
                        moves.push({ square: leftDiag, isCapture: true });
                    }
                }
                
                if (row < 7 && col < 7) {
                    const rightDiag = getSquare(row + 1, col + 1);
                    if (rightDiag && rightDiag.dataset.piece && rightDiag.dataset.color !== color) {
                        moves.push({ square: rightDiag, isCapture: true });
                    }
                }
                break;
                
            case '♘': // Black knight
            case '♞': // White knight
                const knightMoves = [
                    { row: 2, col: 1 }, { row: 2, col: -1 },
                    { row: -2, col: 1 }, { row: -2, col: -1 },
                    { row: 1, col: 2 }, { row: 1, col: -2 },
                    { row: -1, col: 2 }, { row: -1, col: -2 }
                ];
                
                knightMoves.forEach(move => {
                    const newRow = row + move.row;
                    const newCol = col + move.col;
                    if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                        const targetSquare = getSquare(newRow, newCol);
                        if (targetSquare) {
                            if (!targetSquare.dataset.piece || targetSquare.dataset.color !== color) {
                                moves.push({ 
                                    square: targetSquare, 
                                    isCapture: !!targetSquare.dataset.piece 
                                });
                            }
                        }
                    }
                });
                break;
                
            case '♗': // Black bishop
            case '♝': // White bishop
                addDirectionalMoves(1, 1);   // Diagonal down-right
                addDirectionalMoves(1, -1);  // Diagonal down-left
                addDirectionalMoves(-1, 1);  // Diagonal up-right
                addDirectionalMoves(-1, -1); // Diagonal up-left
                break;
                
            case '♖': // Black rook
            case '♜': // White rook
                addDirectionalMoves(1, 0);   // Down
                addDirectionalMoves(-1, 0);  // Up
                addDirectionalMoves(0, 1);   // Right
                addDirectionalMoves(0, -1);  // Left
                break;
                
            case '♕': // Black queen
            case '♛': // White queen
                // Combine rook and bishop moves
                addDirectionalMoves(1, 0);   // Down
                addDirectionalMoves(-1, 0);  // Up
                addDirectionalMoves(0, 1);   // Right
                addDirectionalMoves(0, -1);  // Left
                addDirectionalMoves(1, 1);   // Diagonal down-right
                addDirectionalMoves(1, -1);  // Diagonal down-left
                addDirectionalMoves(-1, 1);  // Diagonal up-right
                addDirectionalMoves(-1, -1); // Diagonal up-left
                break;
                
            case '♔': // Black king
            case '♚': // White king
                // All adjacent squares
                for (let r = -1; r <= 1; r++) {
                    for (let c = -1; c <= 1; c++) {
                        if (r === 0 && c === 0) continue;
                        const newRow = row + r;
                        const newCol = col + c;
                        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                            const targetSquare = getSquare(newRow, newCol);
                            if (targetSquare) {
                                if (!targetSquare.dataset.piece || targetSquare.dataset.color !== color) {
                                    moves.push({ 
                                        square: targetSquare, 
                                        isCapture: !!targetSquare.dataset.piece 
                                    });
                                }
                            }
                        }
                    }
                }
                break;
        }
        
        return moves;
    }
    
    function showPossibleMoves(pieceElement) {
        // First clear any existing move indicators
        clearMoveIndicators();
        
        const moves = getPossibleMoves(pieceElement);
        moves.forEach(move => {
            if (move.isCapture) {
                const indicator = document.createElement('div');
                indicator.className = 'capture-move';
                move.square.appendChild(indicator);
            } else {
                const indicator = document.createElement('div');
                indicator.className = 'possible-move';
                move.square.appendChild(indicator);
            }
        });
    }
    
    function clearMoveIndicators() {
        document.querySelectorAll('.possible-move, .capture-move').forEach(ind => ind.remove());
    }
    
    function computerMove() {
        if (computerThinking) return;
        computerThinking = true;
        gameInfo.textContent = "Computer thinking...";
        
        // Get all computer pieces
        const computerPieces = [];
        document.querySelectorAll(`.square[data-color="black"]`).forEach(sq => {
            computerPieces.push(sq);
        });
        
        // Try to find a capture move first
        let captureMoves = [];
        computerPieces.forEach(piece => {
            const moves = getPossibleMoves(piece);
            moves.forEach(move => {
                if (move.isCapture) {
                    captureMoves.push({
                        piece: piece,
                        move: move
                    });
                }
            });
        });
        
        // If there are capture moves, pick one randomly
        if (captureMoves.length > 0) {
            const randomCapture = captureMoves[Math.floor(Math.random() * captureMoves.length)];
            setTimeout(() => {
                executeMove(randomCapture.piece, randomCapture.move.square);
                computerThinking = false;
            }, 800);
            return;
        }
        
        // If no captures, pick a random piece and move
        if (computerPieces.length > 0) {
            const randomPiece = computerPieces[Math.floor(Math.random() * computerPieces.length)];
            const possibleMoves = getPossibleMoves(randomPiece);
            
            if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                setTimeout(() => {
                    executeMove(randomPiece, randomMove.square);
                    computerThinking = false;
                }, 800);
                return;
            }
        }
        
        // If no moves available, pass the turn
        setTimeout(() => {
            switchPlayer();
            computerThinking = false;
        }, 800);
    }
    
    function executeMove(fromSquare, toSquare) {
        // Move the piece
        const pieceElement = fromSquare.querySelector('span');
        toSquare.innerHTML = '';
        const newPieceElement = document.createElement('span');
        newPieceElement.className = pieceElement.className;
        newPieceElement.textContent = pieceElement.textContent;
        toSquare.appendChild(newPieceElement);
        toSquare.dataset.piece = fromSquare.dataset.piece;
        toSquare.dataset.color = fromSquare.dataset.color;
        toSquare.dataset.hasMoved = 'true';
        
        // Clear the original square
        fromSquare.innerHTML = '';
        fromSquare.removeAttribute('data-piece');
        fromSquare.removeAttribute('data-color');
        fromSquare.removeAttribute('data-hasMoved');
        
        // Mark the piece as moved
        fromSquare.dataset.hasMoved = 'true';
        
        // Clear selection and highlights
        if (selectedPiece) {
            selectedPiece.element.classList.remove('highlight');
            selectedPiece = null;
        }
        clearMoveIndicators();
        
        // Switch player
        switchPlayer();
    }
    
    // Event listeners
    board.addEventListener('click', function(e) {
        if (!gameActive || computerThinking) return;
        if (gameMode === 'computer' && currentPlayer === 'black') return;
        
        const square = e.target.closest('.square');
        if (!square) return;
        
        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);
        const piece = square.dataset.piece;
        const color = square.dataset.color;
        
        // If no piece is selected
        if (!selectedPiece) {
            // If clicking on an empty square or opponent's piece, do nothing
            if (!piece || color !== currentPlayer) return;
            
            // Select the piece
            selectedPiece = {
                row: row,
                col: col,
                element: square
            };
            
            // Highlight the selected piece
            square.classList.add('highlight');
            
            // Show possible moves
            showPossibleMoves(square);
        } 
        // If a piece is already selected
        else {
            // If clicking on the same piece, deselect it
            if (row === selectedPiece.row && col === selectedPiece.col) {
                selectedPiece.element.classList.remove('highlight');
                selectedPiece = null;
                clearMoveIndicators();
                return;
            }
            
            // If clicking on your own piece, select that piece instead
            if (piece && color === currentPlayer) {
                selectedPiece.element.classList.remove('highlight');
                clearMoveIndicators();
                
                selectedPiece = {
                    row: row,
                    col: col,
                    element: square
                };
                
                square.classList.add('highlight');
                showPossibleMoves(square);
                return;
            }
            
            // Check if this is a valid move
            const possibleMoves = getPossibleMoves(selectedPiece.element);
            const isValidMove = possibleMoves.some(move => 
                move.square === square && 
                ((!piece && !move.isCapture) || (piece && move.isCapture && color !== currentPlayer))
            );
            
            if (isValidMove) {
                executeMove(selectedPiece.element, square);
            }
        }
    });
    
    startBtn.addEventListener('click', function() {
        if (!gameActive) {
            startTimer();
        } else {
            pauseGame();
        }
    });
    
    resetBtn.addEventListener('click', resetGame);
});
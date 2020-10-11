console.log("main.js loaded")

// HTML Elements

const statusDiv = document.querySelector('.status-action')  // Status Display shows 1. ? Won 2. ?'s turn 3. Game tied
const resetDiv = document.querySelector('.reset')           // Reset and restart button        
const cellDivs = document.querySelectorAll('.game-cell')    // Board / Grid

// Game Variables

let gameIsAlive = true;
let xToPlay = true;
let oIsAi = undefined;
const winningCombos = [
    [0, 1, 2],                  // Using the array inside array for winning grid
    [3, 4, 5],                  // and array created from div class list
    [6, 7, 8],                  // makes it easier to expand the grid later
    [0, 3, 6],                  // and keep the code really DRY
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

// Game Functions

const checkGameStatus = () => {
    let currentBoard = []
    for (let i=0; i<=8; i++) 
        currentBoard.push(cellDivs[i].classList[2])
    let winner = 'z'
    winningCombos.forEach((winningCombo) => {
        if (currentBoard[winningCombo[0]] &&
            currentBoard[winningCombo[0]] === currentBoard[winningCombo[1]] &&
            currentBoard[winningCombo[0]] === currentBoard[winningCombo[2]]) {
                winner =  currentBoard[winningCombo[0]]
                for (let c=0; c<3; c++) // To change color to red
                    cellDivs[winningCombo[c]].classList.add('won') 
            }
    })
    if (winner === 'x' || winner === 'o') {
        gameIsAlive = false
        statusDiv.innerHTML = winner === 'x' ? "x has won" : oIsAi ? "o (AI) has won": "o has won"
    } else {
        let boardIsFull = true;
        for (let i=0; i<=8; i++)
          if (!currentBoard[i])
            boardIsFull = false;
        if (boardIsFull) {
            statusDiv.innerHTML = "Game is a draw"
            gameIsAlive = false
        } else {
            xToPlay = !xToPlay
            if (xToPlay) {
                statusDiv.innerHTML = "X Goes Next"
            } else  {
                if (oIsAi) {
                    pleasePlayAi() // AI plays for O and makes X's turn next
                    // statusDiv.innerHTML = "X Goes Next" Bug which caused AI to be modest
                } else
                    statusDiv.innerHTML = "O Goes next"
            }
        }        
    }
}

const pleasePlayAi = () => {
    let currentBoardMapped = []
    winningCombos.forEach((winningCombo) => {
        let aWinningRow = []
        aWinningRow.push(cellDivs[winningCombo[0]].classList[2])
        aWinningRow.push(cellDivs[winningCombo[1]].classList[2])
        aWinningRow.push(cellDivs[winningCombo[2]].classList[2])
        currentBoardMapped.push(aWinningRow)
    })

    // AI Play 1, Check any winning possibility for the AI (O)

    for(let i = 0; i<winningCombos.length; i++) {
        if ( currentBoardMapped[i].filter(isX => isX === 'x').length === 0 &&
             currentBoardMapped[i].filter(isO => isO === 'o').length === 2
           ) {
                for(let j=0; j<winningCombos[i].length; j++) {
                    if (currentBoardMapped[i][j] !== 'o') { // Mark the empty slot
                        cellDivs[winningCombos[i][j]].classList.add('o')
                        statusDiv.innerHTML = "O (AI Player) Wins"
                        checkGameStatus()
                        return
                    }
                } 
        }
    }

    // AI Play 2, Sabotage X's potential win row if any

    for(let i = 0; i<winningCombos.length; i++) {
        if ( currentBoardMapped[i].filter(isX => isX === 'x').length === 2 &&
             currentBoardMapped[i].filter(isO => isO === 'o').length === 0
           ) {
                for(let j=0; j<winningCombos[i].length; j++) {
                    if (currentBoardMapped[i][j] !== 'x') { // Mark the empty slot
                        cellDivs[winningCombos[i][j]].classList.add('o')
                        checkGameStatus()
                        return
                    }
                } 
        }
    }

    // AI Play 3, Be center of the board (If X did not steal it already) 

    if (!cellDivs[4].classList[2]) {
        cellDivs[4].classList.add('o')
        checkGameStatus()
        return
    }

    // AI Play 4, Use the first empty cell on the board 

    let currentBoard = []
    for (let i=0; i<=8; i++) 
        currentBoard.push(cellDivs[i].classList[2])
    let emptySlot
    for (emptySlot=0; emptySlot<currentBoard.length; emptySlot++) 
        if (!(currentBoard[emptySlot] === 'x' || currentBoard[emptySlot] === 'o')) 
            break;
    cellDivs[emptySlot].classList.add('o')
    checkGameStatus()
}

// Event Handlers

const clickedOnReset = (e) => {
    xToPlay = true
    gameIsAlive = true
    // statusDiv.innerHTML = "X Goes Next"
    for (const cellDiv of cellDivs) {
        cellDiv.classList.remove('x')
        cellDiv.classList.remove('o')
        cellDiv.classList.remove('won')
    }
    oIsAi = undefined;
    statusDiv.innerHTML = "Tic Tac Toe, Click here for AI"
}

const clickedOnACell = (e) => {
    if (!gameIsAlive)
        return;
    if (oIsAi===undefined)  {  // Started playing without choosing an AI Player
        oIsAi = false;         // Default to "O is a human player"
    }
    // classList Item 0 = game-cell
    // classList Item 1 = pos-??
    // classList Item 2 = x or o
    const classList = e.target.classList;
    if (classList[2] === 'x' || classList[2] === 'o') {
        return;
    }
    classList.add(xToPlay ? 'x' : 'o')
    checkGameStatus()
}

const clickedOnStatus = (e) => {
    if (oIsAi===true || oIsAi===false) // Decided already
        return
    oIsAi = true
    statusDiv.innerHTML = 'X to play first, O will be an AI Player'
}

// Event Listeners

resetDiv.addEventListener('click', clickedOnReset)

for (const cellDiv of cellDivs) {
    cellDiv.addEventListener('click', clickedOnACell)
}

statusDiv.addEventListener('click', clickedOnStatus)


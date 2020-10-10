console.log("main.js loaded")

// HTML Elements

const statusDiv = document.querySelector('.status-action')  // Status Display
console.log(`Status Div ${statusDiv}`)                      // shows 1. ? Won 2. ?'s turn 3. Game tied
const resetDiv = document.querySelector('.reset')           // Reset and restart button
console.log(`Reset Div ${resetDiv}`)
const cellDivs = document.querySelectorAll('.game-cell')  // Board / Grid
console.log(`cellDivs Div ${cellDivs}`)

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
                return
            }
    })
    if (winner === 'x' || winner === 'o') {
        gameIsAlive = false
        statusDiv.innerHTML = winner === 'x' ? "x has won" : "o has won"
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
            if (xToPlay)
                statusDiv.innerHTML = "X Goes Next"
            else
                statusDiv.innerHTML = "O Goes next"
        }        
    }
}

// Event Handlers

const clickedOnReset = (e) => {
    console.log(e);
    xToPlay = true
    gameIsAlive = true
    statusDiv.innerHTML = "X Goes Next"
    for (const cellDiv of cellDivs) {
        cellDiv.classList.remove('x')
        cellDiv.classList.remove('o')
        cellDiv.classList.remove('won')
    }
}

const clickedOnACell = (e) => {
    if (!gameIsAlive)
        return;
    // classList Item 0 = game-cell
    // classList Item 1 = pos-??
    // classList Item 2 = x or o
    const classList = e.target.classList;
    if (classList[2] === 'x' || classList[2] === 'o') {
        return;
    }
    console.log(`loc Div ${classList[1]}`)        
    classList.add(xToPlay ? 'x' : 'o')
    checkGameStatus()
}

const clickedOnStatus = (e) => {
    console.log(e)
    if (oIsAi===true || oIsAi===false) // Decided already
        return
    console.log("AI Undecided")
    oIsAi = true
}

// Event Listeners

resetDiv.addEventListener('click', clickedOnReset)

for (const cellDiv of cellDivs) {
    console.log(`for each cellDivs Div ${cellDiv}`)
    cellDiv.addEventListener('click', clickedOnACell)
}

statusDiv.addEventListener('click', clickedOnStatus)


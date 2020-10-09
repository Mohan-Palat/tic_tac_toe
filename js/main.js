console.log("main.js loaded")

// HTML Elements

const statusDiv = document.querySelector('.status')  // Status Display
console.log(`Status Div ${statusDiv}`)               // shows 1. ? Won 2. ?'s turn 3. Game tied
const resetDiv = document.querySelector('.reset')    // Reset and restart button
console.log(`Reset Div ${resetDiv}`)
const cellDivs = document.querySelectorAll('.game-cell')  // Board / Grid
console.log(`cellDivs Div ${cellDivs}`)

// Game Variables

let gameIsAlive = true;
let xToPlay = true;

// Game Functions

const checkGameStatus = () => {
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
    let currentBoard = []
    for (let i=0; i<=8; i++) 
        currentBoard.push(cellDivs[i].classList[2])
    let winner = 'z'
    winningCombos.forEach((winningCombo) => {
        if (currentBoard[winningCombo[0]] &&
            currentBoard[winningCombo[0]] === currentBoard[winningCombo[1]] &&
            currentBoard[winningCombo[0]] === currentBoard[winningCombo[2]]) {
                winner =  currentBoard[winningCombo[0]]
                for (let c=0; c<3; c++) {
                    cellDivs[winningCombo[c]].classList.add('won') 
                    console.log("c", c)
                    console.log("winningCombo[c]", winningCombo[c])
                    console.log("cellDivs[winningCombo[c]]", cellDivs[winningCombo[c]])
                    console.log("cellDivs[winningCombo[c]].classList", cellDivs[winningCombo[c]].classList)
                    console.log("c", c)
                }
                return
            }
    })
    if (winner === 'x' || winner === 'y') {
        gameIsAlive = false
        statusDiv.innerHTML = winner === 'x' ? "x has won" : "o has won"
    } else {
        let boardIsFull = true;
        for (let i=0; i<=8; i++)
          if (!currentBoard[i])
            boardIsFull = false;
        if (boardIsFull) {
            statusDiv.innerHTML = "Game is tied"
            gameIsAlive = false
        } else {
            xToPlay = !xToPlay
            if (xToPlay)
                statusDiv.innerHTML = "X Goes Next"
            else
                statusDiv.innerHTML = "O goes next"
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

// Event Listeners

resetDiv.addEventListener('click', clickedOnReset)

for (const cellDiv of cellDivs) {
    console.log(`for each cellDivs Div ${cellDiv}`)
    cellDiv.addEventListener('click', clickedOnACell)
}



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
            if (xToPlay) {
                statusDiv.innerHTML = "X Goes Next"
            } else  {
                if (oIsAi) {
                    pleasePlayAi() // AI plays for O and makes X's turn next
                    statusDiv.innerHTML = "X Goes Next"
                } else
                    statusDiv.innerHTML = "O Goes next"
            }
        }        
    }
}

const pleasePlayAi = () => {
    console.log("AI is playing")
    let currentBoardMapped = []
    winningCombos.forEach((winningCombo) => {
        let aWinningRow = []
        aWinningRow.push(cellDivs[winningCombo[0]].classList[2])
        aWinningRow.push(cellDivs[winningCombo[1]].classList[2])
        aWinningRow.push(cellDivs[winningCombo[2]].classList[2])
        currentBoardMapped.push(aWinningRow)
    })
    console.log(currentBoardMapped)

    // AI Play 2, Sabotage X's potential win row if any

    for(let i = 0; i<winningCombos.length; i++) {
        console.log("XLEN", currentBoardMapped[i].filter(isX => isX === 'x').length)
        console.log("OLEN", currentBoardMapped[i].filter(isO => isO === 'o').length)
        if ( currentBoardMapped[i].filter(isX => isX === 'x').length === 2 &&
             currentBoardMapped[i].filter(isO => isO === 'o').length === 0
           ) {
                for(let j=0; j<winningCombos[i].length; j++) {
                    console.log(i, j, "WINCOM", winningCombos[i][j], "MAPPEDBRD", currentBoardMapped[i][j])
                    if (currentBoardMapped[i][j] !== 'x') {
                        cellDivs[winningCombos[i][j]].classList.add('o')
                        checkGameStatus()
                        return
                    }
                } 
            }
    }

    let currentBoard = []
    for (let i=0; i<=8; i++) 
        currentBoard.push(cellDivs[i].classList[2])
    let emptySlot
    for (emptySlot=0; emptySlot<currentBoard.length; emptySlot++) 
        if (!(currentBoard[emptySlot] === 'x' || currentBoard[emptySlot] === 'o')) 
            break;
    cellDivs[emptySlot].classList.add('o')
    console.log(`After AI Plaved ${cellDivs}`)
    checkGameStatus()
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
    oIsAi = undefined;
    statusDiv.innerHTML = "Tic Tac Toe, Click here for AI"
}

const clickedOnACell = (e) => {
    if (!gameIsAlive)
        return;
    if (oIsAi===undefined)  {  // Started playing without choosing an AI Player
        oIsAi = false;         // Default to "O is a human player"
        console.log("O Player defaults to human")
    }
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
    oIsAi = true
    statusDiv.innerHTML = 'X to play first, O will be an AI Player'
}

// Event Listeners

resetDiv.addEventListener('click', clickedOnReset)

for (const cellDiv of cellDivs) {
    console.log(`for each cellDivs Div ${cellDiv}`)
    cellDiv.addEventListener('click', clickedOnACell)
}

statusDiv.addEventListener('click', clickedOnStatus)


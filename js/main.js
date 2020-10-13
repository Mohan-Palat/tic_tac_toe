console.log("main.js loaded")

/* 
******************************************************************************************

Winner Implementation is based on the 2 dimentional arrays below

  Winning Combos         Mapped Board           Current Board Layout
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  0  |  1  |  2  |    |  X  |  O  |  X  |    |  0  |  1  |  2  |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  3  |  4  |  5  |    |  X  |  O  |     |    |  3  |  4  |  5  |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  6  |  7  |  8  |    |     |  O  |     |    |  6  |  7  |  8  |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  0  |  3  |  6  |    |  X  |  X  |     |
  +-----+-----+-----+    +-----+-----+-----+
  |  1  |  4  |  7  | -> |  O  |  O  |  O  |    Current Board Content
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  2  |  5  |  8  |    |     |     |     |    |  X  |  O  |  X  |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  0  |  4  |  8  |    |  X  |  O  |     |    |  X  |  O  |     |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+
  |  2  |  4  |  6  |    |  X  |  O  |     |    |     |  O  |     |
  +-----+-----+-----+    +-----+-----+-----+    +-----+-----+-----+

  HTML Content in the above situation where O has won
      <div class="game-grid">
        <div class="game-cell pos-tl x"></div>
        <div class="game-cell pos-tm o won"></div>
        <div class="game-cell pos-tr x"></div>
        <div class="game-cell pos-ml x"></div>
        <div class="game-cell pos-mm o won"></div>
        <div class="game-cell pos-mr"></div>
        <div class="game-cell pos-bl"></div>
        <div class="game-cell pos-bm o won"></div>
        <div class="game-cell pos-br"></div>
    </div>

Pseudocode (of the initial release on 10/14/2020)
-------------------------------------------------
a. Start up 
   {
     The following will be presented on the UI {
     An empty board, Status/Action Box and Reset button will be 
     User can click on the Status/Action to choose an AI Opponent
     Prompt on Status/Action will be "X to play"
     Switch game alive to "on"
   }

b. Once player clicks on the board cells to play 
   {
     If the game is not alive (dies when someone won or lost or tied)
       Do nothing (Player has to reset to continue)
     Add class x to the correponding Div defenition in the HTML
     Check Game Status
       A. Is there a winner
       {
         If yes, 
           Add class "won" to the 3 winning div elements in HTML
           This will change the winning combo on the board to red
           Switch the game alive to "off"
       }
       B. Is the game tied
       { 
         Happens when the following two conditions are true 
           1. There are no empty cells on the board
           2. There is no winner or looser yet
         If yes, Switch the game alive to "off" and do nothing else
         At this point the player has to click "Reset" to get a new game
       }
       C. If (A) and (B) did not happen, the game needs to continue
       {
         Switch the user (X to O / O to X)
         If O is an AI Player follow the step (c)
       } 
       D. Otherwise
       { 
         Display prompt "O is next" and wait for the user
         Repeat step (b) for player O
       }

c. AI Play       
  The AI plays based on the following four conditions
  If board has a potential winning combination for self [o][o][undefined]
  {
    Mark that game cell to make it [o][o][o]  
  } else If board has a potential winning combination for opponent [x][x][undefined] {
    Sabotage oponent by marking the row thusly - [x][x][x]  
  } else if middle of the board (Cell 4) is available
  {
    Mark Cell 4 with o  
  } else
  {
    Mark the earliest available empty game cell
  }

d. After every play the step (b) is executed to check current job status

c. Player clicked "Reset" Button
   {
      Clear the classes o, x and won
      Do the steps from (a)
   }

  ******************************************************************************************
*/
  
// HTML Elements

const statusDiv = document.querySelector('.status-action')  // Status Display shows 1. ? Won 2. ?'s turn 3. Game tied
const resetDiv = document.querySelector('.reset')           // Reset and restart button        
const cellDivs = document.querySelectorAll('.game-cell')    // Board / Grid

// **********************************************
//              Game Variables
// **********************************************

let gameIsAlive = true;
let xToPlay = true;
let oIsAi = undefined;
let bgMusicIsOn = false;
let userStoppedMusic = false;
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

// **********************************************
//                Game Functions
// **********************************************

// Background Music Setup

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

const bgMusic = new sound("./music/Fireflies.mp3")

// Function Check Game Status - Checks for the following in that order
//   1. There is a win  2. Game is a tie  3. Setup and announce the next player

const checkGameStatus = () => {
    let currentBoard = []
    for (let i=0; i<=8; i++) // Build the current board using the div class o/x currently present
        currentBoard.push(cellDivs[i].classList[2])
 
    let winner = 'z'
    winningCombos.forEach((winningCombo) => { // Check current board against 8 winning combos
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

// Function Please Play AI
//   Play 1. Board has a potential winning combination for self [o][o][undefined]
//   Play 2. Board has a potential winning combination for opponent [x][x][undefined]. Sabotage
//   Play 3. If available, occuppy the middle of the board (Maybe an overkill)
//   Play 4. Occuppy the earliest availavle game cell

const pleasePlayAi = () => {
    let currentBoardMapped = [] // Build current board mapped to each winning combo
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
           ) { // Two O's and no X's in a row on the board
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
           ) { // Two X's and no O's in a row on the board
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

    if (!cellDivs[4].classList[2]) {  // Cell index 4 is the middle of the board
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

// **********************************************
//                Event Handlers
// **********************************************

// Reset Button handler function

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
    bgMusicIsOn = false
    userStoppedMusic = false
}

// Click on a cell function

const clickedOnACell = (e) => {
    // bgSound.play("./music/Saxophone_BG.m4a") m4a not playing
    if (!bgMusicIsOn && !userStoppedMusic) {
        bgMusic.play()
        bgMusicIsOn = true
    }
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
        return; // If the cell has alredy been marked don't do anything 
    }
    classList.add(xToPlay ? 'x' : 'o') // Add a class for the row in HTML
    checkGameStatus()
}

const clickedOnStatus = (e) => { // Status Dispal is used as a button to choose AI Opponent
    if (oIsAi===true || oIsAi===false) { // If decided already, use it to turn off music and do nothing else
        if (bgMusicIsOn) {
            bgMusic.stop()
            bgMusicIsOn = false
            userStoppedMusic = true
        }
        return
    }
    oIsAi = true
    statusDiv.innerHTML = 'X to play first, O will be an AI Player'
}

// Event Listeners

resetDiv.addEventListener('click', clickedOnReset) // Listener for reset button

for (const cellDiv of cellDivs) { // Listener for each each game cell on the grid
    cellDiv.addEventListener('click', clickedOnACell)
}

statusDiv.addEventListener('click', clickedOnStatus) // Listener for status display


# Project 1. Tic Tac Toe

## 1. Technologies used 

HTML, CSS and JavaScript

## 2. Learning experiance / Approach
* Flex Box / Grid
* Object inside another object - Array inside Array, Function inside function and Anonymous functions
* Array Functions - In the following code snippet, we are checking a possible winning combination for player O - If there are two Os and no Xs in a game row on the board, we know O can win. Array function filter makes the implementation simple and elegant 
```JavaScript
        if ( currentBoardMapped[i].filter(isX => isX === 'x').length === 0 &&
             currentBoardMapped[i].filter(isO => isO === 'o').length === 2
           )
```

## 3. Design Components - Wireframe, Pseudocode

### 3.1 Wireframe
![Wireframe](./images/TicTacToe_Wireframe.jpg)

### 3.2 Pseudocode
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
     If the game is not alive (dies when someone has won or lost or tied)  
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
  
e. Player clicked "Reset" Button  
   {  
      Clear the classes o, x and won  
      Do the steps from (a)  
   }  
  
f. Background Music  
   if the player clicks on a game cell on the board music begins to play  
   During the play, if the player wants quite, she or he can click on the status display to pause the player   
  
## 4. User Stories and status of completion
* As a user, I should be able to start a new tic tac toe game. ** Status: Completed **
* As a user, I should be able to click on a square to add X first and then O, and so on ** Status: Completed **
* As a user, I should be shown a message after each turn for if I win, lose, tie or who's turn it is next ** Status: Completed **
* As a user, I should not be able to click the same square twice ** Status: Completed **
* As a user, I should be shown a message when I win, lose or tie ** Status: Completed **
* As a user, I should not be able to continue playing once I win, lose, or tie ** Status: Completed **
* As a user, I should be able to play the game again without refreshing the page ** Status: Completed **

## 5. Planning, Development Process and Problem soving strategy
The original solution was to check each of the eight winning conditions per the grid below (Paragraph 7 Solving for the winner)
It was quite interesting to do the solutioning using arrays instead of tedious if-else's They also provide no scope for expansion
AI development was fun and fulfilling. There were two funny errors as below which were eventually resolved
* Initially I put the "Play" for AI in the same loop which searched for an available location. As soon as it is AI's turn i will fill all available game cell's and declare that is is human player's turn
* There was a bug with AI player that even after winning, it will show the message that it is the human player's turn. It was almost like it is too modest to realize that it has already won

## 6. Unsolved problems which would be fixed in future iterations.
None

## 7. Solving for the winner
Game play is by adding class "x" or "o" to the cell in the game cell div
Cells belomging to the winning combination gets a class "won" added to each
For example the html below, each player has plaed thrice and o has won 
```html
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
```
Every time a player (human or AI) occupies a cell, the following for grids are populates as 2 dim arrays
Grid 4 (mapped current board) will be matched with Grid 4 (winning combinations)
If there are three of the same kind in any of the rows, we have a winner.
We can then map Grid 4 back to Grid 2 to get exact positions (make decisions on the winner, highlight etc.)
### Grid 1. Current Board Content (O has won)
  | COL1 | COL2 | COL3 |
  |:-----:|:-----:|:-----:|
  |  X  |  `O`  |  X  |
  |  X  |  `O`  |     |       
  |     |  `O`  |     |      

### Grid 2. Current board Layout
  | COL1 | COL2 | COL3 |
  |:-----:|:-----:|:-----:|
  |  0  |  1  |  2  |
  |  3  |  4  |  5  |
  |  6  |  7  |  8  |        

### Grid 3. Mapped Current Board (O has won)
  | COL1 | COL2 | COL3 |   
  |:-----:|:-----:|:-----:|
  |  X  |  O  |  X  |      
  |  X  |  O  |     |      
  |     |  O  |     |      
  |  X  |  X  |     |
  |  `O`  |  `O`  |  `O`  |      
  |     |     |     |      
  |  X  |  O  |     |      
  |  X  |  O  |     |    

### Grid 4. Winning Combinations 
  | COL1 | COL2 | COL3|    
  |:-----:|:-----:|:-----:|
  |  0  |  1  |  2  |      
  |  3  |  4  |  5  |      
  |  6  |  7  |  8  |      
  |  0  |  3  |  6  |      
  |  1  |  4  |  7  |      
  |  2  |  5  |  8  |      
  |  0  |  4  |  8  |      
  |  2  |  4  |  6  |      

## 8. How some of my favorite functions work
* Topmost is the AI Implementation (Details in Paragraph 3.2 Pseudocode Item c AI Play above)
* The way the AI looks for a cell on the board to place itself is implemented gracefully. For example, the following code snippet enables the AI to sabotage opponent's potential win
```JavaScript
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
```
* I like Music player and its capabilities 

## 9. Bonus Items completed
* Background music while the play is on
* An unbeatable AI Opponent

## 10. Other requirements completed
* Code is clean and aligned well
* Plenty of comments
* Hover game cell visible indication - Changes to **hot pink**

## 11. Improvements and enhancements for future
* Object Oriented Programming (Convert the code)
* Better Music control
* @media only screen and ....... (Make it ready for smaller screens)
* Pick 2 users passed as parameters to class TicTacToe
* Store the status to keep track of scores in the repeating games
* Expand the board to 4x4, 5x5 .. nxn 
* Enable to play over the internet



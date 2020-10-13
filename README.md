# tic_tac_toe

### Grid 1. Current Board Content (O has won)
  | COL1 | COL2 | COL3 |
  |:-----:|:-----:|:-----:|
  |  X  |  O  |  X  |
  |  X  |  O  |     |       
  |     |  O  |     |      

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
  |  O  |  O  |  O  |      
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





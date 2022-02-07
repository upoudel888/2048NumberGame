import { getByPlaceholderText } from "@testing-library/react";

class Board{
    parent;
    board;
    emptyPos;               //position of unoccupied blocks
    choices;                //numbers that randomly appear on board i.e [2,4]

    needsReset;

    constructor(){
       
        this.board =[
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ] 
        this.emptyPos = Array.from(Array(16).keys());
        this.choices = [2,2,2,4,2,2,2,4,2,2];             //biasing the random number that appear
        this.needsReset = false;
        
    }
    
    
    //when constructor runs in index.js there is no element with class '.game-container'
    //so in App.js we set the parent
    setParent(){
        this.parent = document.querySelector(".game-container");
    }

    resetGame(){
        let allTiles = document.querySelectorAll('.grid-tile');
        if(allTiles){
            allTiles.forEach(elem => elem.remove());
        }
        this.board = [
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ];
        this.emptyPos = Array.from(Array(16).keys());
    }

    
    //update the board with new tile
    // check if new score and new max has been set
    // update the local storage with new board and new score
    update(numberOfInsertions = 1){

        console.log(this.board);

        //remove a tile with .delete class if any
        setTimeout(()=>{
            let removeEle = document.querySelectorAll('.delete');
            if(removeEle){
                removeEle.forEach(ele => ele.remove());
            } 
        },400);

        //this may signify gameOver condition provided there are no valid moves left
        if(this.emptyPos.length === 0) return 0; 

        let sum;
        let max;

        for(var i =0; i< numberOfInsertions; i++){
            
            let randLet = this.choices[Math.floor(Math.random()*this.choices.length)];
            let randPos = this.emptyPos[Math.floor(Math.random()*this.emptyPos.length)];

            //adding new tiles to the DOM
            let childTile = document.createElement('div');
            childTile.classList.add("grid-tile",`pos-${randPos}`,`color-${randLet}`,'scale-in-center');
            childTile.textContent = randLet;
            this.parent.appendChild(childTile);
            
        

            max = 0;
            sum = 0;
    
            for(let i = 0; i<4; i++){
                for(let j=0; j<4; j++){
                    //updating the board and emptyPos Array
                    if(i*4+j === randPos){
                        this.board[i][j] = randLet;
                        //updating the vacant positions on the board
                        let deletePos = this.emptyPos.indexOf(randPos);
                        this.emptyPos.splice(deletePos,1);

                    }
                    //finding max in the board
                    if(this.board[i][j] > max) max = this.board[i][j];

                    //finding the sum of numbers in the board
                    sum+=this.board[i][j]

                }
            }
        }

        // updating and checking the local storage 

        //checking if new best has been set
        let allTimeBest = Number(localStorage.getItem('best2048NumberGame'));
        if(allTimeBest === null){
            allTimeBest = 0;
        }
        if(sum > allTimeBest){
            localStorage.setItem('best2048NumberGame',sum);
            allTimeBest = sum;
        }

        localStorage.setItem("board2048NumberGame",this.board);
        localStorage.setItem("playable2048NumberGame",1);

        return [sum,max,allTimeBest];
    }

    //addFlag is true when two adjacent tiles add up
    //when true the tile which shifts from "from" to "to" is to be removed after shifting
    //and the tile previously at "to" is to be updated with new number
    moveX(from,to,addFlag = false){

        //requires no shifting
        if(from === to) return;

        //selecting the tile specified by from
        //this tile is to be first shifted 
        let tile = document.querySelector(`.grid-tile.pos-${from}:not(.delete)`);
        let factor = to % 4;
        tile.style.marginLeft = `${5*factor + 0.5 * (factor+1)}rem`;   //calculated CSS positioning

        //if addFlag tile at "from" is to be deleted
        if(addFlag){
    
            tile.classList.add('delete');
        
            //updating the tile at "to" with new number and pulsate fwd animation
            let tilePrev = document.querySelector(`.grid-tile.pos-${to}:not(.delete)`);
            tilePrev.classList.remove('scale-in-center','pulsate-fwd');  
            
            setTimeout(()=>{ //shifting of tiles finshes within 150ms only after which numbers update
                tilePrev.textContent = this.board[Math.floor(to/4)][to%4];
                tilePrev.classList.add('pulsate-fwd');
            },150);

            //to delete first zIndex is changed to -1 to make it invisible on the board
            //finally the update method removes the tiles with "delete" class, on next keypress
            setTimeout(()=>{
                let removeEle = document.querySelectorAll('.delete');
                if(removeEle){
                    removeEle.forEach(ele => ele.style.zIndex = -1);
                } 
            },100);

        }else{
            tile.classList.remove('scale-in-center',`pos-${from}`);
            tile.classList.add(`pos-${to}`);
        }
        
    }

    

    moveY(from,to,addFlag = false){

        if(from === to) return;
     
        let tile = document.querySelector(`.grid-tile.pos-${from}:not(.delete)`);
        let factor = Math.floor(to/4);
        tile.style.marginTop = `${5*factor + 0.5 * (factor+1)}rem`;   //calculated CSS positioning
        
        if(addFlag){

            // tile.style.zIndex = '0';
            tile.classList.add('delete');
        
            //updating tile at to
            let tilePrev = document.querySelector(`.grid-tile.pos-${to}`);
            tilePrev.classList.remove('scale-in-center','pulsate-fwd');  
            
            //updating the text content and adding the animation
            setTimeout(()=>{ 
                tilePrev.textContent = this.board[Math.floor(to/4)][to%4];
                tilePrev.classList.add('pulsate-fwd');
            },150);

            //adding delete class and changing the Z index
            setTimeout(()=>{
                let removeEle = document.querySelectorAll('.delete');
                if(removeEle){
                    removeEle.forEach(ele => ele.style.zIndex = -1);
                }        
            },200);

            
        }else{
            tile.classList.remove('scale-in-center',`pos-${from}`);
            tile.classList.add(`pos-${to}`);
        }
    }
            



    //removes empty spaces in the middle of the board while moving left i.e a pressed

    // 2    2   ..  2     changes to    2   2   2   ..        where .. signifies null value
    // ..   ..  ..  2                   2   ..  ..  ..                 on this.board
    // 4    4   4   4                   4   4   4   4
    // ..   ..  2   2                   2   2   ..  ..
    clearLeft(){
    
        let vacantArray = [
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ]

        
        for(let i=0;i<4; i++){
            let nonZeroCount = 0;
            for(let j=0; j<4; j++){
                if(this.board[i][j] !== null){
                    vacantArray[i][nonZeroCount] = this.board[i][j];
                    //updating the dom by shifting the tiles
                    this.moveX(i*4+j,i*4+nonZeroCount);
                    nonZeroCount++;   
                }
                
            }
        }

        this.board = vacantArray;
    }

    //after clearLeft runs this function adds two adjacent tiles if they are same
    //  2   2   2   ..     changes to  4    2   ..  ..
    //  2   ..  ..  ..                 2    ..  ..  .. 
    //  4   4   4   4                  8    8   ..  ..  
    //  2   2   ..  ..                 4    ..  ..  ..  

    addLeft(){
        for(let i =0; i< 4; i++){
            for(let j = 0 ; j<4 ; j++){

                if(this.board[i][j]===this.board[i][j+1] && this.board[i][j+1] !== null){
                    this.board[i][j] += this.board[i][j+1];

                    //updating the dom
                    //shifting tile -> changing zIndex -> removing that tile
                    //because the last parameter is true
                    this.moveX(i*4+(j+1),i*4+j,true);
                   
                    //shifting the preceeding tiles one step left
                    for(let k = j+1; k < 4 ; k++){
                        if(k != 3){
                            this.board[i][k] = this.board[i][k+1];
                            //if k+1 is not null then the corresponding tile div exists
                            if(this.board[i][k+1]){
                                this.moveX(i*4+(k+1),i*4+k);
                            }
                        }else{
                            this.board[i][k] = null;
                        }
                        
                    }      
                }
            }
        }
    }

    
    clearRight(){
        
        let vacantArray = [
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ]
    
 
 
        for(let i=0;i<4; i++){
            let nonZeroCount = 0;
            for(let j=3; j >= 0; j--){
                if(this.board[i][j] !== null){
                    vacantArray[i][3-nonZeroCount] = this.board[i][j];
                    this.moveX(i*4+j,i*4+(3-nonZeroCount));
                    nonZeroCount ++;
                }
            }
        }

        this.board = vacantArray;
        
        
    }

    addRight(){
        for(let i =0; i< 4; i++){
            for(let j = 3; j>=1 ; j--){
                if(this.board[i][j]===this.board[i][j-1] && this.board[i][j-1] !== null){

                    this.board[i][j] += this.board[i][j-1];

                    this.moveX(i*4+(j-1),i*4+j,true);

                    for(let k = j-1; k >= 0 ; k--){
                        if(k != 0){
                            this.board[i][k] = this.board[i][k-1];
                            if(this.board[i][k-1]){
                                this.moveX(i*4+(k-1),i*4+k);
                            }
                            
                        }else{
                            this.board[i][k] = null;
                            
                        }
                    }
                }
            }
        }
    }

        
   
    clearUp(){
    
        let vacantArray = [
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ]   

        for(let j=0;j<4; j++){
            let nonZeroCount = 0;
            for(let i=0; i<4; i++){
                if(this.board[i][j] != null){
                    vacantArray[nonZeroCount][j] = this.board[i][j];
                    this.moveY(i*4+j,4*nonZeroCount+j);
                    nonZeroCount ++;
                }
            }
        }

        this.board = vacantArray;
        
    }

    
    addUp(){

        
        for(let j =0; j< 4; j++){
            for(let i = 0 ; i<3 ; i++){

                if(this.board[i][j]===this.board[i+1][j] && this.board[i+1][j] != null){
                    this.board[i][j] += this.board[i+1][j];
                    this.moveY((i+1)*4+j,i*4+j,true)

                    for(let k = i+1; k < 4 ; k++){
                        if(k != 3){
                            this.board[k][j] = this.board[k+1][j]
                            if(this.board[k+1][j]){
                                this.moveY((k+1)*4+j,k*4+j);
                            }
                        }else{         
                            this.board[k][j] = null;
                        }
                        
                    } 
                }

                
            }
        }
    }

    clearDown(){
    
        let vacantArray = [
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null]
        ]
    
        for(let j=0;j<4; j++){
            let nonZeroCount = 0;
            
            for(let i=3; i>=0; i--){
                if(this.board[i][j] != null){
                    vacantArray[3-nonZeroCount][j] = this.board[i][j];
                    this.moveY(i*4+j,(3-nonZeroCount)*4+j)

                    nonZeroCount ++;
                }
            }
        }

        this.board = vacantArray;
        
    }

    addDown(){
        for(let j =0; j< 4; j++){
            for(let i = 3 ; i>=1 ; i--){
                
                if(this.board[i][j]===this.board[i-1][j] && this.board[i-1][j] !== null){
                    this.board[i][j] += this.board[i-1][j];        
                    this.moveY((i-1)*4+j,i*4+j,true);
                    for(let k = i-1; k >= 0 ; k--){
                        if(k != 0){
                            this.board[k][j] = this.board[k-1][j]
                            if(this.board[k][j]){
                                this.moveY((k-1)*4+j,k*4+j)
                            }
                        }else{
                            
                            this.board[k][j] = null;
                        }
                        
                    } 
                }
            }
        }
    }

    updateEmptyPos(){
        let count = 0;
        let ele;
        this.emptyPos = new Array;
        for(let i =0; i< 4; i++){
            for(let j = 0 ; j<4 ; j++){
                if(this.board[i][j] === null){
                    this.emptyPos.push(count);
                }else{
                    //updating tile content just in case moveX and moveY don't work as expected
                    setTimeout(()=>{
                        ele = document.querySelector(`.grid-tile.pos-${i*4+j}:not(.delete)`);
                        if(ele){
                            ele.textContent = this.board[i][j];
                            ele.classList.add(`color-${this.board[i][j]}`);                       
                        }
                    },150);
                }
                count ++;
            }
        }
    }

    //when user presses a key
    a_pressed(){
        this.clearLeft();
        this.addLeft();
        this.updateEmptyPos();
    }

    //when user presses d key
    d_pressed(){
        this.clearRight();
        this.addRight();
        this.updateEmptyPos();
    }

    //when user presses w key
    w_pressed(){
        this.clearUp();
        this.addUp();
        this.updateEmptyPos();
    }

    //when user presses s key
    s_pressed(){
        this.clearDown();
        this.addDown();
        this.updateEmptyPos();
    }

    //returns true if game is playable
    checkPlayable(){
        let flag = false;

        if(this.emptyPos.length) return true;
        for(let i =0 ; i < 3 ; i++){
            for(let j = 0; j < 3 ; j++ ){
                if(this.board[i][j] === this.board[i][j+1] || this.board[i][j]===this.board[i+1][j]){
                    return true;
                }
            }
        }
        for( let i = 0 ; i < 3 ; i++){
            if(this.board[i][3] === this.board[i+1][3]){
                flag = true;
            }
            if(this.board[3][i] === this.board[3][i+1]){
                flag = true;
            }
        }
        
        return flag;
    }

    //setsBoardFromLocal
    setFromLocal(){
        let boardOnLocalStorage = localStorage.getItem('board2048NumberGame');

        let boardArray = boardOnLocalStorage.split(",",16);

        for(let i = 0; i < 4; i++){
            for(let j =0 ; j<4 ; j++){
                let num = boardArray[i*4+j];
                if(num){
                    this.board[i][j] = Number(num);
                    let childTile = document.createElement('div');
                    childTile.classList.add("grid-tile",`pos-${i*4+j}`,`color-${num}`,'scale-in-center');
                    childTile.textContent = Number(num);
                    this.parent.appendChild(childTile);
                }
            }
        }
        this.updateEmptyPos();
        return [boardArray.reduce((sum,val)=>sum+Number(val),0),Math.max(...boardArray)];
    }
}

export default Board;


import { getByPlaceholderText } from "@testing-library/react";

class Board{
    parent;
    board;
    emptyPos;               //position of unoccupied blocks
    choices;                //numbers that randomly appear on board i.e [2,4]

    needsReset;
    processing;

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
        this.processing = false;
    }
    
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

    //adds 2 or 4 in vacant blocks and updates the DOM
    //returns 0 if no empty position is found
    //return maximum digit on the board if update is successful

    //resetFlag is true when the user presses newGame button
    update(numberOfInsertions = 1){

        console.log(this.board);

        //this may signify gameOver condition provided there are no valid moves left
        if(this.emptyPos.length === 0) return 0; 

        
        
        let sum;
        let max;
        let prevPos;
        for(var i =0; i< numberOfInsertions; i++){
            
            let randLet = this.choices[Math.floor(Math.random()*this.choices.length)];
            let randPos = this.emptyPos[Math.floor(Math.random()*this.emptyPos.length)];

            //adding new tiles to the DOM
            let childTile = document.createElement('div');
            childTile.classList.add("grid-tile",`pos-${randPos}`,'scale-in-center');
            childTile.textContent = randLet;
            this.parent.appendChild(childTile);
        

            max = 0;
            sum = 0;
            let count =0;

            for(let i = 0; i<4; i++){
                for(let j=0; j<4; j++){

                    //updating the board and emptyPos
                    if(count === randPos){
                        this.board[i][j] = randLet;
                        //updating the latest emptyPos
                        let deletePos = this.emptyPos.indexOf(randPos);
                        this.emptyPos.splice(deletePos,1);

                    }
                    //finding max in board
                    if(this.board[i][j] > max) max = this.board[i][j];

                    //finding the sum
                    sum+=this.board[i][j]

                    count++;
                }
            }
            prevPos = randPos;
        }
        return [sum,max];
    }


    //this function is exception handler
    //exception occurs when code is ahed of the DOM
    //like when .grid-tile.pos-10 is being accessed when it is just updating in DOM
    updateTileFromBoard(from = -1,addFlag){
        let allTiles = document.querySelectorAll('.grid-tile');
        if(allTiles){
            allTiles.forEach(elem => elem.remove());
        }
        for(let i = 0; i<4; i++){
            for(let j = 0; j<4; j++){
                if(this.board[i][j]){
                    if(addFlag && i*4+j == from){
                        continue;
                    }else{
                        let childTile = document.createElement('div');
                        childTile.classList.add("grid-tile",`pos-${i*4+j}`);
                        this.parent.appendChild(childTile);
                        childTile.textContent = this.board[i][j];
                    }
                    
                    
                }
            }
        }

        
    }



    moveX(from,to,addFlag = false){
        //selecting the tile specified by from
        //this tile is to be removed
        try{
            let tile = document.querySelector(`.grid-tile.pos-${from}`);

            if(!tile) throw [from,to,addFlag];
           
            let factor = to % 4;
            tile.style.marginLeft = `${5*factor + 0.5 * (factor+1)}rem`;   //calculated CSS positioning

        
            if(addFlag){

                tile.style.zIndex = '0';
                
                tile.classList.add('delete');
            
                //selecting the tile that was previously there to where we shift
                //the updating it with the new number with pulsate-fwd animation
                let tilePrev = document.querySelector(`.grid-tile.pos-${to}`);
                tilePrev.textContent = this.board[Math.floor(to/4)][to%4];
                tilePrev.classList.remove('scale-in-center','pulsate-fwd');  
                
                setTimeout(()=>{
                    tilePrev.classList.add('pulsate-fwd');
                },100);

                //200ms because the animation if of that duration
                setTimeout(()=>{
                    let removeEle = document.querySelector('.delete');
                    if(!removeEle){
                        console.log('trying to remove from',from)
                    }
                    removeEle.remove(); 

                },100);

                
            }else{
                tile.classList.remove('scale-in-center',`pos-${from}`);
                tile.classList.add(`pos-${to}`);
            }
        }catch([from,to,addFlag]){
            console.log("here\nhere\nhere");
            console.log(from,'-->',to,addFlag);
            this.updateTileFromBoard(from);

        }
    }

    

    moveY(from,to,addFlag = false){

        try{
            //selecting the tile specified by from
            //this tile is to be removed
            let tile = document.querySelector(`.grid-tile.pos-${from}`);

            if(!tile) throw [from,to,addFlag];
           
            let factor = Math.floor(to/4);
            tile.style.marginTop = `${5*factor + 0.5 * (factor+1)}rem`;   //calculated CSS positioning
            if(addFlag){
    
                tile.style.zIndex = '0';
                tile.classList.add('delete');
            
                //selecting the tile that was previously there to where we shift
                //the updating it with the new number with pulsate-fwd animation
                let tilePrev = document.querySelector(`.grid-tile.pos-${to}`);
                tilePrev.textContent = this.board[Math.floor(to/4)][to%4];
                tilePrev.classList.remove('scale-in-center','pulsate-fwd');  
    
                setTimeout(()=>{
                    tilePrev.classList.add('pulsate-fwd');
                },100);
    
                //200ms because the animation if of that duration
                setTimeout(()=>{
                    let removeEle = document.querySelector('.delete');
                    if(!removeEle){
                        console.log('trying to remove from',from)
                    }
                    removeEle.remove();
                },200);
    
                
            }else{
                tile.classList.remove('scale-in-center',`pos-${from}`);
                tile.classList.add(`pos-${to}`);
            }
            
        }catch([from,to,addFlag]){
            console.log("here\nhere\nhere");
            console.log(from,'-->',to,addFlag);
            this.updateTileFromBoard(from,addFlag);
        }      
    }
    
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
                    //updating the dom
                    this.moveX(i*4+j,i*4+nonZeroCount);
                    nonZeroCount++;   
                }
                
            }
        }

        this.board = vacantArray;
    }


    
    
    //moves blocks to the left 
    addLeft(){
        for(let i =0; i< 4; i++){
            for(let j = 0 ; j<4 ; j++){

                if(this.board[i][j]===this.board[i][j+1] && this.board[i][j+1] !== null){
                    this.board[i][j] += this.board[i][j+1];

                    // //updating the dom
                    this.moveX(i*4+(j+1),i*4+j,true);
                   
                    //shifting tile -> changing zIndex -> removing that tile
                    //because the last param is true
                    
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


    
    
    //moves blocks to the left 
    addRight(){
        for(let i =0; i< 4; i++){
            for(let j = 3; j>=1 ; j--){
                //if two adjacent ones are found equal DOUBLE THE RIGHT ONE AND SHIFT THE PRECEEDING ONES 
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

    //moves blocks to the left 
    addUp(){

        
        for(let j =0; j< 4; j++){
            for(let i = 0 ; i<3 ; i++){
                //if two adjacent ones are found equal DOUBLE THE FIRST ONE AND SHIFT THE PRECEEDING ONES

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

    //moves blocks to the left 
    addDown(){
        for(let j =0; j< 4; j++){
            for(let i = 3 ; i>=1 ; i--){
                //if two adjacent ones are found equal DOUBLE THE FIRST ONE AND SHIFT THE PRECEEDING ONES

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
        this.emptyPos = new Array;
        for(let i =0; i< 4; i++){
            for(let j = 0 ; j<4 ; j++){
                if(this.board[i][j] === null){
                    this.emptyPos.push(count);
                }
                count ++;
            }
        }
    }

    //when user presses a key
    a_pressed(){
        this.processing = true;
        this.clearLeft();
        this.addLeft();
        this.updateEmptyPos();
        this.processing = false;
    }

    //when user presses d key
    d_pressed(){
        this.processing = true;
        this.clearRight();
        this.addRight();
        this.updateEmptyPos();
        this.processing = false;
    }

    //when user presses w key
    w_pressed(){
        this.processing = true;
        this.clearUp();
        this.addUp();
        this.updateEmptyPos();
        this.processing = false;

    }

    //when user presses s key
    s_pressed(){
        this.processing = true;
        this.clearDown();
        this.addDown();
        this.updateEmptyPos();
        this.processing = false;
    }

    //check if GAME IS OVER
    //returns 1 if game is not over
    checkOver(){
        for(let i =0 ; i < 3 ; i++){
            for(let j = 0; j < 3 ; j++ ){
                if(this.board[i][j] === this.board[i][j+1] || this.board[i][j]===this.board[i+1][j]){
                    return true;
                }
            }
        }
        let flag = false;
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


}

export default Board;


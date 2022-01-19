
class Board{
    blocks;
    score;

    board;
    emptyPos;               //position of unoccupied blocks
    choices;                //numbers that randomly appear on board i.e [2,4]

    needsReset;


    constructor(){

        this.parent = document.querySelector(".game-container");
        this.score = document.querySelector(".score");
        this.getEvents = true;
        this.firstAnimation = true;

        this.board =[] 
        let tile = {id : "01",value : null, 
                    nameClass: ['sub-container','len-1','','no-style'],
                    transform: ['X',0] //direction factor
                } 
        //configuring mainBoard
        for(let row = 0; row < 4; row++){
            let rowArr = [];
            let id;
            for(let col = 0; col <4; col++){
                id = String(row) + String(col);
                tile.id = id;
                rowArr.push(JSON.parse(JSON.stringify(tile)));
            }
            this.board.push(rowArr);
        }

        this.emptyBoard = JSON.parse(JSON.stringify(this.board));
        this.tempBoard = JSON.parse(JSON.stringify(this.board));

        this.emptyPos = Array.from(Array(16).keys());
        this.choices = [4,2];
        this.needsReset = false;
    }

    returnBoard(){
        return this.board;
    }

    printBoard(board1){
        for(let i=0;i<4; i++){
            let rowArr = [];
            for(let j=0;j<4; j++){
                rowArr.push(board1[i][j].value);
            }
            console.log(rowArr);
        }
    }

    //before Every Operation resetTempBoard to default one
    resetTempBoard(){
        this.tempBoard = JSON.parse(JSON.stringify(this.emptyBoard));
    }


    //adds 2 or 4 in vacant blocks and updates the DOM
    //returns 0 if no empty position is found
    //return maximum digit on the board if update is successful
    update(numberOfInsertions = 1,resetFlag = false){
        if(this.emptyPos.length === 0) return 0; 
        // console.log("empty pos are aa",this.emptyPos);
        
        
        let max;
        let prevPos;
        for(var i =0; i< numberOfInsertions; i++){
            
            let randLet = this.choices[Math.floor(Math.random()*2)];
            let randPos = this.emptyPos[Math.floor(Math.random()*this.emptyPos.length)];

            const childTile = document.createElement("div");
            childTile.classList.add('grid-tile',`pos-${randPos}`);
            childTile.textContent = randLet;

            this.parent.appendChild(childTile)
            
            max = 0;
            let count =0;

            for(let i = 0; i<4; i++){
                for(let j=0; j<4; j++){

                    //updating the board
                    if(count === randPos){
                        
                        this.board[i][j].value = randlet;

                        //scale in center animation
                        this.board[i][j].nameClass[3]='scale-in-center';

                        //updating the latest emptyPos
                        let deletePos = this.emptyPos.indexOf(randPos);
                        this.emptyPos.splice(deletePos,1);
                    }else{
                        if(resetFlag && count!==prevPos){
                            this.board[i][j].value = null;
                        }
                    }
                    //finding the max number
                    if(this.board[i][j].value > max) max = this.board[i][j].value;

                    count++;
                }
            }
            prevPos = randPos;
        }

        //updating the max-score

        // this.score.classList.remove("blink-1");
        // if(this.score.textContent != String(max)){
        //     this.score.innerHTML = String(max);
        //     var self2 = this.score;
        //     setTimeout(function(){
        //         self2.classList.add('blink-1');
        //     },1);

        // }
        
        return max;
    }

    
    clearLeft(){

        this.resetTempBoard();
        for(let i=0;i<4; i++){
            let nonZeroCount = 0;
            let nullPassCount = 0;
            for(let j=0; j<4; j++){
                if(this.board[i][j].value !== null){
                    this.tempBoard[i][nonZeroCount].value = this.board[i][j].value;
                    this.tempBoard[i][j].transform[0] = "X";
                    this.tempBoard[i][j].transform[1] += nullPassCount;
                    // animateObj[i*4+j] = nullPassCount;         
                    // this.updateDOM(i*4+nonZeroCount,this.board[i][j]); //updating new position
                    
                    nonZeroCount ++;
                }else{
                    nullPassCount++;
                }
            }
        }
        this.board = JSON.parse(JSON.stringify(this.tempBoard));
    }


    
    
    //moves blocks to the left 
    addLeft(){
        
        for(let i =0; i< 3; i++){
            for(let j = 0 ; j<3 ; j++){

                if(this.board[i][j].value===this.board[i][j+1].value && this.board[i][j+1].value !== null){
                    this.board[i][j].value += this.board[i][j+1].value;
                    this.board[i][j].nameClass[3] = "pulaste-fwd";

                    for(let k = j+1; k < 4 ; k++){
                        if(k !== 3){
                            this.board[i][k].value = this.board[i][k+1].value;
                        }else{
                            this.board[i][k].value = null;
                        }
                        
                    }
                }
            }
        }
    }

    
    clearRight(){
        this.resetTempBoard();

        let boardCount = 0;
        for(let i=0;i<4; i++){
            let nonZeroCount = 0;
            let nullPassCount = 0;
            for(let j=3; j >= 0; j--){
                if(this.board[i][j].value !== null){
                    this.tempBoard[i][3-nonZeroCount].value = this.board[i][j].value;
                    
                    nonZeroCount ++;
                }else{
                    nullPassCount++;
                }
                boardCount +=1;
            }
        }
        this.board = JSON.parse(JSON.stringify(this.tempBoard));
    }


    
    
    //moves blocks to the left 
    addRight(){
        for(let i =0; i< 4; i++){
            for(let j = 3; j>=1 ; j--){

                if(this.board[i][j].value===this.board[i][j-1].value && this.board[i][j-1].value !== null){
                    this.board[i][j].value += this.board[i][j-1].value;
                    this.board[i][j].nameClass[3] = "pulaste-fwd";

                    for(let k = j-1; k >=0 ; k--){
                        if(k !== 0){
                            this.board[i][k].value = this.board[i][k-1].value;
                        }else{
                            this.board[i][k].value = null;
                        }
                        
                    }
                }
            }
        }
    }
    
    
    clearUp(){
        this.resetTempBoard();
    
        for(let j=0;j<4; j++){
            let nonZeroCount = 0;
            let nullPassCount = 0;
            for(let i=0; i<4; i++){
                if(this.board[i][j].value !== null){
                    this.tempBoard[nonZeroCount][j].value = this.board[i][j].value;
                    
                    nonZeroCount ++;
                }else{
                    nullPassCount++;
                }
            }
        }
        this.board = JSON.parse(JSON.stringify(this.tempBoard));
    }


    
    
    //moves blocks to the left 
    addUp(){
        
        for(let j =0; j< 4; j++){
            for(let i = 0 ; i<3 ; i++){

                if(this.board[i][j].value===this.board[i+1][j].value && this.board[i+1][j].value !== null){
                    this.board[i][j].value += this.board[i+1][j].value;
                    this.board[i][j].nameClass[3] = "pulaste-fwd";

                    for(let k = i+1; k < 4 ; k++){
                        if(k !== 3){
                            this.board[k][j].value = this.board[k+1][j].value;
                        }else{
                            this.board[k][j].value = null;
                        }
                        
                    }
                }
            }
        }
        
    }
    
    clearDown(){
        this.resetTempBoard();
    
        for(let j=0;j<4; j++){
            let nonZeroCount = 0;
            let nullPassCount = 0;
            for(let i=3; i>=0; i--){
                if(this.board[i][j].value !== null){
                    this.tempBoard[3-nonZeroCount][j].value = this.board[i][j].value;
                    nonZeroCount ++;
                }else{
                    nullPassCount++;
                }
            }
        }
        this.board = JSON.parse(JSON.stringify(this.tempBoard));
    }


    
    
    //moves blocks to the left 
    addDown(){
        

        for(let j =0; j< 4; j++){
            for(let i = 3 ; i>=1 ; i--){

                if(this.board[i][j].value===this.board[i-1][j].value && this.board[i-1][j].value !== null){
                    this.board[i][j].value += this.board[i-1][j].value;
                    this.board[i][j].nameClass[3] = "pulaste-fwd";

                    for(let k = i-1; k >= 0 ; k--){
                        if(k !== 0){
                            this.board[k][j].value = this.board[k-1][j].value;
                        }else{
                            this.board[k][j].value = null;
                        }
                        
                    }
                }
            }
        }
        
    }
    

    

    updateEmptyPos(){
        let count = 0;
        this.emptyPos = [];
        for(let i =0; i< 4; i++){
            for(let j = 0 ; j<4 ; j++){
                if(this.board[i][j].value === null) this.emptyPos.push(count);
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
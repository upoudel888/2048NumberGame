import React from 'react'
import {useState,useEffect} from 'react'

import Grid from './grid'
import Scores from './scores'

const Body = ({game}) => {
    
    const [tileCount,setTileCount] = useState(0);
    

    let [firstLoad,setFirstLoad] = useState(true);
    let [keyDown,setKeyDown] = useState(false);
    let [scoreMaxArr,setScoreMaxArr] = useState([0,0]);

    const handlePlayPress = ()=>{
        game.setParent();
        game.update(2);
        document.querySelector('.play-btn').style.visibilty = 'hidden';
    }

    const handleKeyPress = (e)=>{

        let updateFlag = true;
        let boardBeforeUpdate = game.board;
        
        if(!keyDown){
            setKeyDown(true);
            console.log(e.key);
            switch(e.key){
                case 'a':
                case 'ArrowLeft':
                    game.a_pressed();
                    break;
                case 's':
                case 'ArrowDown':
                    game.s_pressed();
                    break;
                case 'd':
                case 'ArrowRight':
                    game.d_pressed();
                    break;
                case 'w':
                case 'ArrowUp':
                    game.w_pressed();
                    break;
                default:
                    console.log("Wrong choice");
                    updateFlag = false;
                    break;
            }
            if(updateFlag){
                if(JSON.stringify(game.board)!==JSON.stringify(boardBeforeUpdate)){
                    let status = game.update();
                    if(status == 0){
                        if(game.checkOver() == false){
                           console.log("You are out of moves");
                           game.needsReset = true;
                        }
                    }else{
                        setScoreMaxArr(status);
                    }
                }
            } 
        }
    }

    const handleKeyUp = ()=>{
        setKeyDown(false);
    }

    const handleNewGame = ()=>{
        game.resetGame();
        game.setParent();
        game.update(2);
        setScoreMaxArr([0,0]);
    }

    useEffect(()=>{
        document.addEventListener("keypress",handleKeyPress);
        
        return ()=>{
            document.removeEventListener("keypress",handleKeyPress)
        }
    },[tileCount]);

    useEffect(()=>{
        document.addEventListener("keyup",handleKeyUp);

        return ()=>{
            document.removeEventListener("keyup",handleKeyUp);
        }
    },[keyDown]);



    return ( 
        <React.Fragment>

            <Scores scoreMax = {scoreMaxArr} newGame = {handleNewGame}/>
            
            <Grid arr = {[...Array(16).keys()]} name = {['game-container','grid-cell']}></Grid>
            <button className = "play-btn" onClick = {handlePlayPress}>play</button>
           
            
        </React.Fragment>
     );
}
 
export default Body;
// import logo from './logo.svg';
import React from 'react'
import {useState,useEffect} from 'react'

import {Grid,Scores} from './components'
import './App.css';

function App({game}) {
    
  const [scoreMaxArr,setScoreMaxArr] = useState([0,0]);
  const [gameStatus,setGameStatus] = useState(null); //becomes 'lost' if user is out of moves

  const handleKeyPress = (e)=>{

    let updateFlag = true;
    let boardBeforeUpdate = game.board;
    let status = -1;

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
        updateFlag = false;
        break;
    }
    if(updateFlag){
      if(JSON.stringify(game.board)!==JSON.stringify(boardBeforeUpdate)){
        status = game.update();
        if(status !== 0){
          setScoreMaxArr(status);
        }
      }else{
        if(game.checkPlayable()===false){
          setGameStatus('lost')
          game.needsReset = true;
        }
      }
    } 
    
  }

  const handleNewGame = ()=>{
    setGameStatus(null)
    game.resetGame();
    game.setParent();
    game.update(2);
    setScoreMaxArr([0,0]);
  }

  useEffect(()=>{
      document.addEventListener("keydown",handleKeyPress);
      
      return ()=>{
          document.removeEventListener("keydown",handleKeyPress)
      }
  },[game]);

  return (
    <React.Fragment>
      <Scores scoreMax = {scoreMaxArr} newGame = {handleNewGame}/>
      <Grid arr = {[...Array(16).keys()]} name = {['game-container','grid-cell']} tryAgain = {handleNewGame} gameStatus = {gameStatus}/>
    </React.Fragment>   
  );
}

export default App;

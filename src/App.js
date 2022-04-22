// import logo from './logo.svg';
import React from 'react'
import {useState,useEffect} from 'react'

import swipeDetect from './modules/mobileEvents';

import {Grid,Scores,Description} from './components'
import './App.css';

function App({game}) {

  const [scoreMaxArr,setScoreMaxArr] = useState([0,0]);
  const [gameStatus,setGameStatus] = useState(null); //becomes 'lost' if user is out of moves
  const [bestScore,setBestScore] = useState(0);

  const handleKeyPress = (e)=>{
    console.log(e.key);
    gameHandler(e.key); 
  }

  const gameHandler = (direction) =>{

    let updateFlag = true;
    let boardBeforeUpdate = game.board;
    let status = -1;

    console.log(direction);
    switch(direction){
      case 'a':
      case 'ArrowLeft':
      case 'left':
        game.a_pressed();
        break;
      case 's':
      case 'ArrowDown':
      case 'down':
        game.s_pressed();
        break;
      case 'd':
      case 'ArrowRight':
      case 'right':
        game.d_pressed();
        break;
      case 'w':
      case 'ArrowUp':
      case 'up':
        game.w_pressed();
        break;
      default:
        updateFlag = false;
        break;
    }
    if(updateFlag){
      if(JSON.stringify(game.board)!==JSON.stringify(boardBeforeUpdate)){
        status = game.update(); //returns array [sum,max,allTimeBestScore]
        if(status !== 0){
          setScoreMaxArr([status[0],status[1]]);
          setBestScore([status[2]]);
          
        }
      }else{
        if(game.checkPlayable()===false){
          setGameStatus('lost')
          localStorage.setItem('playable2048NumberGame',0);
        }
      }
    } 
    
  }

  const handleNewGame = ()=>{
    setGameStatus(null);
    game.setParent();
    game.resetGame();
    game.update(2);
    setScoreMaxArr([0,0]);
  }

  
  useEffect(()=>{
      document.addEventListener("keydown",handleKeyPress);
      let el = document.querySelector('.overlay');
      swipeDetect(el,directionCallback)
      return ()=>{
          document.removeEventListener("keydown",handleKeyPress)
      }
  },[game]);
  
  const directionCallback = direction => {
    
    gameHandler(direction);
  };
  //this sippet runs after the first render is complete
  //it sets the board back to where the user left
  useEffect(()=>{
    game.setParent();
    if(Number(localStorage.getItem('playable2048NumberGame'))){
      let [sum,max,best] = game.setFromLocal(); //this method returns an array [sum,max,bestScore]
      setScoreMaxArr([sum,max]);
    }
    //returns unidentified if not found
    let scoreOnLocal = localStorage.getItem('best2048NumberGame');
    if(scoreOnLocal === null) scoreOnLocal = 0;
    setBestScore(Number(scoreOnLocal));
    
    
    
    
  },[]);

  return (
    <div className="whole-game-container">
      <Scores scoreMaxBest = {[scoreMaxArr,bestScore]} newGame = {handleNewGame}/>
      <Grid arr = {[...Array(16).keys()]} name = {['game-container','grid-cell']} tryAgain = {handleNewGame} gameStatus = {gameStatus} />
      <Description/>
    </div>

  );
}

export default App;

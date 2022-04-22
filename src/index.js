import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import './index.css';
import Board from './modules/board'
// import './modules/swiped-events.min.js'

let game = new Board();

ReactDOM.render(
  <React.StrictMode>
    <App game = {game}/>
  </React.StrictMode>,
  document.getElementById('root')
);


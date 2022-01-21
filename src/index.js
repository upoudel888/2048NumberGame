import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './board'
import Body from './body';

let game = new Board();


ReactDOM.render(
  <React.StrictMode>
    <Body game = {game}/>
  </React.StrictMode>,
  document.getElementById('root')
);


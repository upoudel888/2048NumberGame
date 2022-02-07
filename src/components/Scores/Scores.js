import "./Scores.css"

/*
    scoreMax is array i.e. [maxOnBoard,totalScore]
    newGame is handler function for when "New Game button is pressed"
*/
const Scores = ({scoreMaxBest,newGame}) => {
    return ( 
        <div className="score-board">
            <div className="score">Score: <br/> <span className="score-numbers">{scoreMaxBest[0][0]}</span> </div>
            <div className="max">Max : <br /> <span className="score-numbers">{scoreMaxBest[0][1]}</span></div>          
            <button className="new-game" onClick={newGame}>New game</button>
            <div className="best-score">Best : <span className="score-numbers">{scoreMaxBest[1]}</span></div>
        </div>
     );
}
 
export default Scores;
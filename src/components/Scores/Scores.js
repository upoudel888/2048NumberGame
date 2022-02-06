import "./Scores.css"

/*
    scoreMax is array i.e. [maxOnBoard,totalScore]
    newGame is handler function for when "New Game button is pressed"
*/
const Scores = ({scoreMax,newGame}) => {
    return ( 
        <div className="score-board">
            <div className="score">Score: <br/> <span className="score-numbers">{scoreMax[0]}</span> </div>
            <div className="max">Max : <br /> <span className="score-numbers">{scoreMax[1]}</span></div>          
            <button className="new-game" onClick={newGame}>New game</button>
        </div>
     );
}
 
export default Scores;
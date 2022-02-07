import './Grid.css'

/*
    arr = empty array of lenght 16
    name = [container-name,item-class-name]
        = ["game-container",".grid-cell"]
    
*/
const Grid = ({arr,name,tryAgain,gameStatus}) => {
    let status = (gameStatus === 'lost')? 0.6:0;
    let styleForOverlay = {
        opacity : status
    }
    let visible = (gameStatus === 'lost')?"inherit":'hidden';
    let styleForMessage = {
        visibility : visible
    }
    return (
        <div className={name[0]}>
            {  
                arr.map(elem => {
                        return(<div className={name[1] + ` pos-${elem}`} key ={elem}></div>)
                })
                
            }
            <div className="overlay" style = {styleForOverlay}>
            </div>
            <div className="message msg1" style = {styleForMessage}>Out of moves<br/>
                <button className = 'try-again' onClick = {tryAgain}>Try Again</button>
            </div>
        </div>
     );
}
 
export default Grid;
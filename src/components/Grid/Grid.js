import './Grid.css'

/*
    arr = empty array of lenght 16
    name = [container-name,item-class-name]
        = ["game-container",".grid-cell"]
    
*/
const Grid = ({arr,name}) => {
    return (
        <div className={name[0]}>
            {  
                arr.map(elem => {
                        return(<div className={name[1] + ` pos-${elem}`} key ={elem}></div>)
                })
                
            }
        </div>
     );
}
 
export default Grid;
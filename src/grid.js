const Grid = ({arr,firstLoad}) => {
    
    return (
        <div className="grid-container">
            {
                arr.map((elem)=>{
                    let nameOfClass = `grid-item pos-${elem}`;
                    if(!firstLoad){
                        if(elem % 2 === 1){
                            nameOfClass = `grid-item pos-${elem-1}`;
                        }
                    }
                    return(
                        <div className={nameOfClass} key ={elem}>{elem}</div>
                    )
                })
            }
        </div>
     );
}
 
export default Grid;
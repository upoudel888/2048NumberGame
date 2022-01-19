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
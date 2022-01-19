import Grid from './grid'
import React from 'react'

import {useState,useEffect} from 'react'


const Body = () => {
    let tile = {
        pos: 0,
        value: null
    }
    const [tileCount,setTileCount] = useState(0);
    

    let [firstLoad,setFirstLoad] = useState(true);

    const handleKeyPress = ()=>{
        if(tileCount < 16){
            const childTile = document.createElement("div");
            childTile.classList.add('grid-tile',`pos-${tileCount}`);
            childTile.textContent = 2;
    
            var parent = document.querySelector(".game-container");
            parent.appendChild(childTile)
            setTileCount(tileCount+1);
            console.log("this code is runnig");
        }else{
            var tileSelect = document.querySelector(`.grid-tile.pos-${tileCount%15}`)
            setInterval(()=>tileSelect.classList.remove(`pos-${tileCount%15}`),1);
            setTimeout(()=>{
                tileSelect.classList.add(`pos-${(tileCount+1) % 15}`);
            },300);
            setTileCount(tileCount+1);
            
        }
    }

    useEffect(()=>{
        document.addEventListener("keypress",handleKeyPress);
        return ()=>{
            document.removeEventListener("keypress",handleKeyPress)
        }
    },[tileCount]);

    return ( 
        <React.Fragment>
            <Grid arr = {[...Array(16).keys()]} name = {['game-container','grid-cell']}></Grid>
            
            <button onClick = {handleKeyPress}>play</button>
        </React.Fragment>
     );
}
 
export default Body;
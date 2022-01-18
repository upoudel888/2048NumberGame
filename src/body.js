import Grid from './grid'
import React from 'react'

import {useState} from 'react'


const Body = () => {
    let tile = {
        pos: 0,
        value: null
    }
    const [arr,setArr] = useState([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

    let [firstLoad,setFirstLoad] = useState(true);

    function transform(){
        setFirstLoad(!firstLoad);
        
    }
    return ( 
        <React.Fragment>
            <Grid arr = {arr} firstLoad = {firstLoad}></Grid>
            <button onClick = {transform}>ClickMe</button>
        </React.Fragment>
     );
}
 
export default Body;
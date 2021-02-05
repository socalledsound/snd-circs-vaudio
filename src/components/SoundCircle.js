import React from 'react'


const SoundCircle = ({id, x, y, r, fill, playSound}) => {
    return ( 
        <circle 
            cx={x}
            cy={y}
            r={r}
            fill={fill}
            onClick={() => playSound(id)}/>        
     );
}
 
export default SoundCircle

import React from 'react'

const Slider = ({ name, minVal, maxVal, value, updateParent }) => {
    return ( 
        <div className="slider-container">
            <input 
                type="range"
                style={{width: '600px'}}
                name={name}
                min={minVal}
                max={maxVal}
                value={value}
                onChange={(e) => updateParent(name, e.target.value)}
            />
        </div>
     );
}
 
export default Slider;

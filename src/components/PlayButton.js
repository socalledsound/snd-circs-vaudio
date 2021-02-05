import React from 'react'

const Button = ({ trigParent, text }) => {
    return ( 

        <button onClick={trigParent}> {text}</button>

     );
}
  
export default Button


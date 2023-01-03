import React from 'react'

const Backdrop = ({setBackdropIsHidden}) => {
  return (
    <div
      className='z-10 absolute bg-opacity-50 bg-black'
      style={{
        top: "-96px",
        bottom: "-126px",
        left: "-13px",
        right: "-20px"
      }}
      onClick={() => setBackdropIsHidden(true)}
    >      
    </div>
  )
}

export default Backdrop
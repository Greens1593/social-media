import React from 'react'

const Backdrop = ({backdropIsHidden, hideBackdrop}) => {
  return (
    <div> {!backdropIsHidden &&
      <div
        className='z-10 fixed bg-opacity-50 bg-black top-0 bottom-0 right-0 left-0'
        onClick={hideBackdrop}
      >
      </div>}
    </div>
  )
}

export default Backdrop
import React from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { urlFor } from '../client'

const Backdrop = ({ setBackdropIsHidden, image }) => {
  
  
  return (
    <div
      className='z-10 absolute bg-opacity-50 bg-black top-0 bottom-0 left-0 right-0 flex pt-20 justify-center'
      onClick={() => setBackdropIsHidden(true)}
    >      
      <div
        className='absolute object-cover overflow-hidden z-20'
        style={{maxWidth: "90%", maxHeight: "90%"}}
        >
          <img src={urlFor(image).url()} alt="user-post"/>
            <AiOutlineCloseCircle
              className="absolute top-2 right-2 bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              onClick={() => setBackdropIsHidden(true)}
            />
      </div>
    </div>
  )
}

export default Backdrop
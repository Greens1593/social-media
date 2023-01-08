import React, { useRef } from 'react'
import Masonry from 'react-masonry-css'
import Pin from './Pin'

const breakpointObj = {
  default: 4, 
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ pins, setBackdropIsHidden, setImage }) => {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
      {
        pins?.map((pin) =>
          <Pin
            pin={pin}
            className="w-max"
            key={pin._id}
            setImage={setImage}
            setBackdropIsHidden={setBackdropIsHidden}
          />)
      }
    </Masonry>
  )
}

export default MasonryLayout
import React, {useState, useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'

import { v4 as uuidv4 } from 'uuid'

import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/data'
import Spinner from './Spinner'
import Backdrop from './Backdrop'
import { useRef } from 'react'

const PinDetail = ({ user }) => {

  const [pins, setPins] = useState(null)
  const [pinDetails, setPinDetails] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const [backdropIsHidden, setBackdropIsHidden] = useState(true)
  const [image, setImage] = useState(null)

  const pinDetailsElement = useRef(null)

  const {pinId} = useParams()


  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId)

    if (query) {
      client.fetch(query)
        .then(data => {
          setPinDetails(data[0])

          if (data[0]) {
            const query = pinDetailMorePinQuery(data[0])
            client.fetch(query)
              .then(data => setPins(data))
          }
        })
    }
  }

  const addComment = () => {
    if (comment) {
      setAddingComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('')
          setAddingComment(false)
        })
    }
  }

  useEffect(() => {
    fetchPinDetails()
    pinDetailsElement?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [pinId])

  if(!pinDetails) return <Spinner message='Loading pin...'/>
  

  return (
    <>
    <div
      ref={pinDetailsElement}
      className='flex xl-flex-row flex-col m-auto bg-white'
      style={{maxWidth: '1500px', borderRadius: '32px'}}
    >
      <div className='flex justify-center items-center md:items-start flex-initial'>
        <img
          src={pinDetails?.image && urlFor(pinDetails.image).url()}
          className='rounded-t-3xl rounded-b-lg'
          alt='pin' />
      </div>
      <div className='w-full p-5 flex-1 xl:min-w-620'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-2 items-center'>
            <a
              href={`${pinDetails.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
            >
              <MdDownloadForOffline/>
            </a>
          </div>
          <a href={`${pinDetails.destination}`} target="_blank" rel='noreferrer'>
              {pinDetails.destination}
          </a>
        </div>
        <div>
          <h1 className='text-4xl font-bold break-words mt-3'>
            {pinDetails.title}
          </h1>
          <p className='mt-3'>{pinDetails.about}</p>
        </div>
        <Link to={`user-profile/${pinDetails.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
                <img
                    className='w-8 h-8 rounded-full object-cover'
                    src={pinDetails.postedBy?.image}
                    alt="user-profile" />
                <p className='font-semibold capitalize'>{pinDetails.postedBy?.userName}</p>
        </Link>
        <h2 className='mt-5 text-2xl'>Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
          {(!pinDetails.comments || pinDetails.comments.length[0]) ? <p className='mt-3'>No comments here</p> : pinDetails?.comments?.map((comment, i) => (
            <div
              className='flex gap-2 mt-5 items-center bg-white rounded-lg'
              key={i}
            >
              <img
                src={comment.postedBy.image}
                alt="user-profile"
                className='w-10 h-10 rounded-full cursor-pointer'
              />
              <div className='flex flex-col'>
                <p className='font-bold'>{comment.postedBy.userName}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-wrap mt-6 gap-3'>
          <Link to={`user-profile/${pinDetails.postedBy?._id}`}>
            <img
              className='w-10 h-10 rounded-full cursor-pointer'
              src={user?.image}
              alt="user-profile"
            />
          </Link>
          <input
            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
            type="text"
            placeholder='Add d comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type='button'
            className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
            onClick={addComment}
          >
            {addingComment ? 'Postting the comment' : "Post"}
          </button>
        </div>
      </div>
    </div>
    {
    pins?.length > 0 ? (<>
      <h2 className='text-center font-bold text-2x mt-8 mb-4'>
      More like this
      </h2>
         {pins && <MasonryLayout pins={pins} setImage={setImage} setBackdropIsHidden={setBackdropIsHidden} />}
        {!backdropIsHidden && <Backdrop image={image} setBackdropIsHidden={setBackdropIsHidden} />}
    </>) : (<Spinner message="Loading more pins.."/>)
    }
    </>
  )
}

export default PinDetail
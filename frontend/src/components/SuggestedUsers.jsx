import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

function SuggestedUsers() {
  const { suggestedUsers } = useSelector(store => store.auth)
  return (
    <div className='my-10'>
      <div className='flex items-center justify-between gap-2 text-sm'>
        <h1 className=' font-semibold text-gray-600'>Suggested for you</h1>
        <span className='font-medium cursor-pointer'>See all</span>
      </div>
      {
        suggestedUsers?.map((user) => {
          return (
            <div key={user._id}>
              <div className='flex items-center gap-2 my-5'>
                      <Link to={`/profile/${user?._id}`}>
                        <Avatar>
                          <AvatarImage src={user?.profilePicture} alt="Post_image" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div >
                        <h1 className='font-semibold text-sm'><Link>{user?.username}</Link></h1>
                        <span className='text-sm text-gray-600'>{
                          user?.bio || 'Bio here'
                        }</span>
              
                      </div>
              
                    </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default SuggestedUsers
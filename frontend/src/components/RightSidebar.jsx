import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'


function RightSidebar() {
  const { user } = useSelector(store => store.auth)
  return (
    <div className='w-fit my-6 pr-32'>
      <div className='flex items-center gap-2'>
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
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar
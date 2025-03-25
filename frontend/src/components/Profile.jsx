import useGetUserProfile from '@/hooks/useGetUserProfile';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

function Profile() {
  const params = useParams();
  const userId = params.id;
  const { userProfile, user } = useSelector((store) => store.auth);
  useGetUserProfile(userId);

  const isLoggedInUserProfile = user?._id == userProfile?._id;
  const isFollowing = false;
  const [activeTab, setActiveTab] = useState('posts');

  const handleTabChange = (tabText) => {
    setActiveTab(tabText);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex max-w-6xl justify-center pl-10 mx-auto ml-[16%] w-[calc(100%-16%)]'>
      <div className='flex flex-col gap-20 p-8 w-full'>
        <div className='grid grid-cols-2'>
          <section className='flex items-center justify-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-5'>
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <div className='flex items-center gap-2'>
                    <Link to='/account/edit'>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>
                        Edit Profile
                      </Button>
                    </Link>

                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>
                      View Archive
                    </Button>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>
                      Ad tools
                    </Button>
                  </div>
                ) : isFollowing ? (
                  <>
                    <Button className='bg-[#0095f6] hover:bg-[#286791] h-8'>Unfollow</Button>
                    <Button className='bg-[#0095f6] hover:bg-[#286791] h-8'>Message</Button>
                  </>
                ) : (
                  <Button className='bg-[#0095f6] hover:bg-[#286791] h-8'>Follow</Button>
                )}
              </div>
              <div className='flex items-center gap-4'>
                <p>
                  <span className='font-semibold'>{userProfile?.posts?.length}</span> Posts
                </p>
                <p>
                  <span className='font-semibold'>{userProfile?.followers?.length}</span> followers
                </p>
                <p>
                  <span className='font-semibold'>{userProfile?.following?.length}</span> following
                </p>
              </div>
              <div className='flex flex-col gap-3'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign className='' />
                  <span className='pl-2'>{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-300'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
          <div className='grid grid-cols-3 gap-3'>
            {displayedPost?.map((post) => (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img src={post?.Image} alt='post_image' className='rounded-sm w-full aspect-square object-cover' />
                <div className=' absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex ite text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>

                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
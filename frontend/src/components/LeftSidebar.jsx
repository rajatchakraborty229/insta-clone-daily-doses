import React, { useState } from 'react'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser, setSelectedUser, setUserProfile } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost, } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

function LeftSidebar() {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const { likeNotification } = useSelector(store => store.realTimeNotification)

    const sideBarItems = [
        {
            icon: <Home />,
            text: "Home"
        },
        {
            icon: <Search />,
            text: "Search"
        },
        {
            icon: <TrendingUp />,
            text: "Explore"
        },
        {
            icon: <MessageCircle />,
            text: "Messages"
        },
        {
            icon: <Heart />,
            text: "Notification"
        },
        {
            icon: <PlusSquare />,
            text: "Create"
        },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>{user?.username ? user.username.charAt(0).toUpperCase() : "?"}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        {
            icon: <LogOut />,
            text: "Logout"
        },
    ]

    const handleLogout = async () => {
        try {
            const res = await axios.get("http://localhost:5100/api/v1/user/logout",
                {
                    withCredentials: true
                }
            )
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                dispatch(setUserProfile(null))
                dispatch(setSelectedUser(null))
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log("error in handleLogout", error.response);
        }
    }

    const sidebarHandler = async (textType) => {
        if (textType == 'Logout') {
            handleLogout()
        } else if (textType == 'Create') {
            if (!user) {
                navigate('/login')
            }
            setOpen(true)
        } else if (textType == 'Profile') {
            navigate(`/profile/${user?._id}`)
        }
        else if (textType == 'Home') {
            navigate('/')
        }
        else if (textType == 'Messages') {
            navigate('/chat')
        }
    }

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-green-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
            <h1 className='text-xl font-bold py-4 px-2'>Daily Doses</h1>
                <div >
                    {
                        sideBarItems.map((item, index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3 m-3'>
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text == 'Notification' && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div>
                                                        <Button size='icon' className='rounded-full bg-red-600 hover:bg-red-600 h-5 w-5 absolute bottom-6 left-6'>{likeNotification?.length}</Button>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length == 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification?.userDetails?.profilePicture} />
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm '> <span className='font-bold'>{notification?.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    )
}

export default LeftSidebar;

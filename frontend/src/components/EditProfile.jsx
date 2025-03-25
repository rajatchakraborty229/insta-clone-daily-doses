import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { setAuthUser } from '@/redux/authSlice'


function EditProfile() {
    const { user } = useSelector(store => store.auth)
    const imageRef = useRef()
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setInput({ ...input, profilePhoto: file })
        }
    }

    const handleGenderChange = (value) => {
        setInput({ ...input, gender: value })
    }

    const handleEditProfile = async () => {
        const formData=new FormData();
        formData.append("bio",input.bio)
        formData.append("gender",input.gender)
        if(input.profilePhoto){
            formData.append("profilePhoto",input.profilePhoto)
        }
        try {
            setLoading(true)
            const res = await axios.post(`https://insta-clone-daily-doses.onrender.com/api/v1/user/profile/edit`,formData,{
                headers:{
                    'Content-Type':"multipart/form-data"
                },
                withCredentials:true
            });
            if(res.data.success){
                const updatedUserData={
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user?.gender
                }
                dispatch( setAuthUser(updatedUserData))
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(("error in handleEditprofile", error));

        }finally{
            setLoading(false)
        }
    //    console.log("Edit profile inputs",input);
       
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className=' font-bold text-xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-200 rounded-xl p-2'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage  src={user?.profilePicture} alt="Post_image" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div >
                            <h1 className='font-bold text-sm'>{user?.username}</h1>
                            <span className='text-sm text-gray-600'>{
                                user?.bio || 'Bio here'
                            }</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={handleFileChange} type="file" className=' hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#317cad]'>Change Photo</Button>
                </div>
                <div>
                    <h1 className='font-bold text-xl mb-2'>Bio</h1>
                    <Textarea name='bio' value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} className=' focus-visible:ring-transparent' />
                </div>

                <div>
                    <h1 className='font-bold mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={handleGenderChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder='select' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Famale</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? <Button className='w-fit bg-[#0095F6] hover:bg-[#40a0e0] '>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait</Button>
                            : <Button className='w-fit bg-[#0095F6] hover:bg-[#40a0e0]' onClick={handleEditProfile}>Submit</Button>
                    }

                </div>
            </section>

        </div>
    )
}

export default EditProfile
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { readFileasDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPosts } from '@/redux/postSlice'


function CreatePost({ open, setOpen }) {
    const imageRef = useRef()
    const [file, setFile] = useState('')
    const [caption, setCaption] = useState('')
    const [imagePreview, setImagePreview] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useSelector(store => store.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {posts}=useSelector(store=>store.post)

    const handleCreatePost = async (e) => {
        if (!user) {
            return navigate("/login")
        }
        const formData = new FormData()
        formData.append("caption", caption)
        if (imagePreview) {
            formData.append("image", file)
        }

        try {
            setLoading(true)
            const res = await axios.post("https://insta-clone-daily-doses.onrender.com/api/v1/post/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setPosts([res.data.post, ...posts]))
                setOpen(false)
                setFile("");
                setImagePreview("")
                setCaption("")
                navigate('/')

                toast.success(res.data.message)
            }
        } catch (error) {
            console.log("error in hadnle create post", error);
            toast.error(error.response.data.message)

        }
        finally {
            setLoading(false)
        }

    }

    const fleChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file)
            const dataUrl = await readFileasDataURL(file)
            setImagePreview(dataUrl)
        }

    }
    return (
        <div>
            <Dialog open={open}>

                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader className='text-center font-semibold'>
                        Create New Post
                    </DialogHeader>
                    <div className='flex gap-3 items-center'>
                        <Avatar>
                            <AvatarImage src='' alt='img' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-semibold text-xs'>{user?.username}</h1>
                            <span className='text-gray-600 text-xs'>{user?.bio}</span>
                        </div>
                    </div>

                    <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className=' focus-within:ring-transparent border-none ' placeholder='Write a caption' />
                    {
                        imagePreview && (
                            <div className='w-full h-64 flex items-center justify-center '>
                                <img src={imagePreview} alt="preview_image" className='object-cover h-full w-full rounded-md' />
                            </div>
                        )
                    }
                    <input ref={imageRef} type="file" className='hidden' onChange={fleChangeHandler} />
                    <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#358cc7]'>Select from device</Button>
                    {imagePreview && (
                        loading ? (
                            <Button>
                                Please wait
                                <Loader2 className='mr-2 h-2 w-2 animate-spin' />
                            </Button>
                        ) :
                            (<Button onClick={handleCreatePost} type='submit'>Post</Button>)
                    )}

                </DialogContent>

            </Dialog>
        </div >
    )
}

export default CreatePost
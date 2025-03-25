import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, Loader2, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

function Post({ post }) {

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const { user } = useSelector(store => store.auth)
  const [loading, setLoading] = useState(false)
  const { posts } = useSelector(store => store.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const dispatch = useDispatch()
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)

  const handleInputTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText('')
    }
  }
  const handleDeletePost = async () => {
    try {
      setLoading(true)
      const res = await axios.delete(`https://insta-clone-daily-doses.onrender.com/api/v1/post/delete/${post._id}`, {
        withCredentials: true
      })
      if (res.data.success) {
        const updatedPosts = posts.filter((item) => item?._id != post?._id)
        dispatch(setPosts(updatedPosts))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  const handleLikeDislike = async () => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.post(
        `https://insta-clone-daily-doses.onrender.com/api/v1/post/${post?._id}/${action}`,
        {}, // Empty object since we don't send data in the body
        { withCredentials: true } // Move this here
      );
      if (res.data.success) {
        const upadtedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(upadtedLikes)
        setLiked(!liked)
        const upadtedPostsData = posts.map(p =>
          p._id == post._id ? {
            ...p,
            likes: liked ? p.likes.filter(id => id != user._id) : [...p.likes, user._id]
          } : p
        )
        dispatch(setPosts(upadtedPostsData))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleComment = async () => {
    try {
      const res = await axios.post(`https://insta-clone-daily-doses.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        const upadtedCommentData = [...comment, res.data.comment]
        setComment(upadtedCommentData)
        const upadtedPostData = posts.map(p =>
          p._id == post._id ? { ...p, comments: upadtedCommentData } : p
        )
        dispatch(setPosts(upadtedPostData))

        toast.success(res.data.message)
        setText('');
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  const handleBookmark=async()=>{
    try{
        const res=await axios.get(`https://insta-clone-daily-doses.onrender.com/api/v1/post/bookmark/${post?._id}`,{
            withCredentials:true
        })
        if(res.data.success){
          toast.success(res.data.message)
        }
    }catch(error){
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className='mb-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="Post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='flex items-center gap-3'>
          <h1>{post.author?.username}</h1>
          {user?._id == post?.author._id &&  <Badge variant="secondary">Author</Badge> }
         
          </div>
         
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className='cursor-pointer' />
          </DialogTrigger>
          <DialogContent className='flex flex-col items-center text-center'>
            <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold' >Unfollow</Button>
            <Button variant='ghost' className='cursor-pointer w-fit ' >Add to favourites</Button>
            {user && user?._id == post?.author._id && (
              loading ? (
                <Button>
                  Deleting...
                  <Loader2 className='mr-2 h-2 w-2 animate-spin' /></Button>
              ) :
                (
                  <Button variant='ghost' onClick={handleDeletePost} className='cursor-pointer w-fit text-[#ec4654] font-bold' >Delete</Button>
                )
            )
            }

          </DialogContent>
        </Dialog>

      </div>
      <img className='rounded-sm my-2 w-full aspect-square object-cover' src={post.Image} alt="" />

      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-2'>
          {
            liked ? <FaHeart onClick={handleLikeDislike} size={22} className=' cursor-pointer text-red-600' /> :
              <FaRegHeart onClick={handleLikeDislike} size={'22px'} className='cursor-pointer ' />
          }

          <MessageCircle onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true);
          }}
            className='cursor-pointer hover:text-green-600'
          />
          <Send className='cursor-pointer hover:text-green-600' />
        </div>
        <Bookmark onClick={handleBookmark} className=' cursor-pointer hover:text-gray-600' />
      </div>
      <span className="font-medium block mb-2">{postLike} likes</span>

      <p className="">
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>
      {
        comment.length > 0 &&
        <span onClick={() => {
          dispatch(setSelectedPost(post))
          setOpen(true);
        }} className=' cursor-pointer'>View {comment.length} comments</span>
      }

      <CommentDialog open={open} setOpen={setOpen} post={post} />
      <div className="flex items-center justify-between">
        <input type="text"
          placeholder='Add a comment...'
          className='outline-none text-sm w-[90%] '
          value={text}
          onChange={handleInputTextChange}
        />
        {text && <span onClick={handleComment} className='text-blue-600 cursor-pointer' >Post</span>}
      </div>

    </div>
  )
}

export default Post
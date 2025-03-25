import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useSelector, useDispatch } from 'react-redux';
import Comment from './Comment';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';

function CommentDialog({ open, setOpen }) {
    const [text, setText] = useState('');
    const { selectedPost } = useSelector(store => store.post);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    };

    const handleComment = async () => {
        try {
            const res = await axios.post(
                `http://localhost:5100/api/v1/post/${selectedPost._id}/comment`,
                { text },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                // Update the comments in the selected post
                const updatedComments = [...selectedPost.comments, res.data.comment];
                const updatedPost = { ...selectedPost, comments: updatedComments };

                // Update the posts array in the Redux store
                const updatedPosts = posts.map(p =>
                    p._id === selectedPost._id ? updatedPost : p
                );

                // Update both the posts and selectedPost in the Redux store
                dispatch(setPosts(updatedPosts));
                dispatch(setSelectedPost(updatedPost)); // Update the selectedPost

                toast.success(res.data.message);
                setText(''); // Clear the input field after posting the comment
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl p-0 flex flex-col'>
                <div className="flex flex-1 ">
                    <div className='w-1/2'>
                        <img src={selectedPost?.Image}
                            alt=""
                            className='w-full object-cover rounded-l-lg h-full'
                        />
                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>
                                            CN
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs '>{selectedPost?.author?.username}</Link>
                                    {/* <span>BIO herre...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className=' flex flex-col items-center text-sm text-center'>
                                    <div className=' cursor-pointer w-full text-red-400 font-bold'>
                                        Unfollow
                                    </div>
                                    <div className=' cursor-pointer w-full'>
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        {/* Comments Section with Overflow Handling */}
                        <div className='flex-1 overflow-y-auto max-h-[300px] p-4'>
                            {
                                selectedPost?.comments?.map((comment) => (
                                    <Comment key={comment._id} comment={comment} />
                                ))
                            }
                        </div>
                        <div className='p-4 flex items-center gap-2'>
                            <input
                                type="text"
                                placeholder='Add a comment...'
                                className='w-full outline-none border border-grey-300 p-1.5 rounded '
                                value={text}
                                onChange={changeEventHandler}
                            />
                            <Button variant='outline' onClick={handleComment} disabled={!text.trim()}>Send</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CommentDialog;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { MessageCircleCode } from 'lucide-react';
import { Button } from './ui/button';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { toast } from 'sonner';


function ChatPage() {
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const messageSendSound = new Audio('/sounds/message_sent.mp3');

  const handleSendMessage = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://insta-clone-daily-doses.onrender.com/api/v1/message/send/${receiverId}`,
        { message },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages || [], res.data.newMessage])); // Ensure messages is an array
        setMessage(""); // Clear input field after sending
        messageSendSound.play();
      }
    } catch (e) {
      console.log("Error in sending message", e);
      toast.error("Failed to send message");
    }
  };






  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className='flex ml-[16%] h-screen'>
      {/* Left Sidebar */}
      <section className='w-full my-4 md:w-1/4'>
        <h1 className='font-bold mb-3 px-3 text-xl'>{user.username}</h1>
        <hr className='mb-4 border-gray-300 w-full' />
        <div className='overflow-y-auto h-[80vh]'>
          {suggestedUsers?.map((user) => {
            const isOnline = onlineUsers.includes(user?._id);
            return (
              <div
                key={user._id}
                onClick={() => dispatch(setSelectedUser(user))}
                className='flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer'
              >
                <Avatar className='w-14 h-14'>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='font-medium'>{user?.username}</span>
                  <span
                    className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {isOnline ? 'online' : 'offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Section */}
      {selectedUser ? (
        <section className='flex-1 border-l border-gray-300 flex flex-col h-full'>
          {/* Chat Header */}
          <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white'>
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-medium'>{selectedUser?.username}</span>
              <span className='text-xs text-gray-500'>
                {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <Messages selectedUser={selectedUser} />

          {/* Message Input */}
          <div className='flex items-center p-4 border-t border-gray-300'>
            <input
              type='text'
              className='flex-1 mr-2 focus-visible:ring-transparent p-2 border border-gray-300 rounded-lg'
              placeholder='Type a message...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  handleSendMessage(selectedUser?._id);
                }
              }}
            />
            <Button onClick={() => handleSendMessage(selectedUser?._id)} disabled={!message || !selectedUser}>Send</Button>
          </div>
        </section>
      ) : (
        <div className='flex flex-col items-center justify-center mx-auto'>
          <MessageCircleCode className='w-32 h-32 my-4' />
          <h2>Your Messages</h2>
          <span>Send a message to start chat</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
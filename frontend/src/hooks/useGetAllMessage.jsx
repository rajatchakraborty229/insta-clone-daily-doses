

import React,{ useEffect } from "react"

import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "@/redux/postSlice"
import { setMessages } from "@/redux/chatSlice"

const useGetAllMessage = () => {
    const dispatch = useDispatch()
    const { selectedUser } = useSelector(store => store.auth) // Changed from store.chat to store.auth

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUser?._id) return // Add null check
            
            try {
                const res = await axios.get(
                    `https://insta-clone-daily-doses.onrender.com/api/v1/message/all/${selectedUser._id}`, 
                    { withCredentials: true }
                )
                
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages))
                }
            } catch (e) {
                console.log("Error in getallmessages", e)
            }
        }
        
        fetchAllMessage()
    }, [selectedUser?._id, dispatch]) // Add dependencies
}

export default useGetAllMessage;
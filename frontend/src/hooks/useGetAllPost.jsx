import React,{ useEffect } from "react"

import axios from "axios"
import { useDispatch } from "react-redux"
import { setPosts } from "@/redux/postSlice"

const useGetAllPost=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchAllPost=async()=>{
            try{
                const res=await axios.get("http://localhost:5100/api/v1/post/all",{
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                    // console.log(res.data.posts);
                    
                }
            }catch(e){
                console.log("error in getallpost",e);
                
            }
        }
        fetchAllPost()
    },[dispatch])
}

export default useGetAllPost;
import React,{ useEffect } from "react"

import axios from "axios"
import { useDispatch } from "react-redux"

import { setSuggestedUsers } from "@/redux/authSlice"

const useGetSuggestedUsers=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchSuggestedUsers=async()=>{
            try{
                const res=await axios.get("https://insta-clone-daily-doses.onrender.com/api/v1/user/suggested",{
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users))
                    // console.log(res);
                    
                }
            }catch(e){
                console.log("error in getsuggesteduser",e);
                
            }
        }
        fetchSuggestedUsers()
    },[])
}

export default useGetSuggestedUsers;
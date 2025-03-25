import React,{ useEffect } from "react"

import axios from "axios"
import { useDispatch } from "react-redux"

import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice"

const useGetUserProfile=(userId)=>{
    const dispatch=useDispatch()
    
    useEffect(()=>{
        const fetchUserProfile=async()=>{
            try{
                const res=await axios.get(`http://localhost:5100/api/v1/user/${userId}/profile`,{
                    withCredentials:true
                })
                if(res.data.success){
                    dispatch(setUserProfile(res.data.user))
                    // console.log(res);
                    
                }
            }catch(e){
                console.log("error in usergetprofile",e);
                
            }
        }
        fetchUserProfile()
    },[userId])
}

export default useGetUserProfile;
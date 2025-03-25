import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

function Login() {
    const {user}=useSelector(store=>store.auth)
    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch=useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value,
        });
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const res = await axios.post(
                "http://localhost:5100/api/v1/user/login",
                input,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            
    
            if (res.data.success) {
                dispatch(
                    setAuthUser(res.data.user)
                )
                toast.success(res.data.message); // Use text directly
                setInput({ email: "", password: "" });
    
              
                    navigate("/");
               
            } else {
                toast.error(res.data.message); // Use text directly
                
                
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(()=>{
        if(user){
            navigate('/')
        }
    })
    return (
        <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
            <form
                onSubmit={handleLogin}
                className="shadow-lg flex flex-col gap-6 p-7 w-full max-w-sm bg-white rounded-lg"
            >
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
                    <p className="text-sm text-gray-600">Login to see photos & videos</p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={input.password}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;

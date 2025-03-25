import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

function SignUp() {
  const { user } = useSelector(store => store.auth)
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5100/api/v1/user/register", input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // console.log(res.data.message);

      if (res.data.success) {
        toast.success(res.data.message); // Correct usage for Sonner
        setInput({ username: "", email: "", password: "" });


      } else {
        toast.error(res.data.message); // Correct usage for Sonner


      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignUp} className="shadow-lg flex flex-col gap-4 p-7 lg:w-[400px] bg-white rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Logo</h1>
          <p className="text-sm text-gray-600">Sign up to create an account</p>
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" name="username" value={input.username} onChange={handleChange} placeholder="Enter your username" />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" name="email" value={input.email} onChange={handleChange} placeholder="Enter your email" />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" value={input.password} onChange={handleChange} placeholder="Enter your password" />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="text-center text-sm">Already have an account?
          <Link to="/login" className="text-blue-500"> Login</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;

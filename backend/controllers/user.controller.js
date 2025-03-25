import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, check again!",
                success: false
            });
        }

        // Check if email already exists
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(401).json({
                message: "Email already exists!",
                success: false
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(401).json({
                message: "Password must have at least 6 characters!",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate a token
        const token = await jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Prepare the user object to send back
        const user = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        };

        // Send the token as a cookie and return the response
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day expiration
        }).status(201).json({
            message: "Account created successfully",
            success: true,
            user
        });

    } catch (error) {
        console.log("Error in register controller:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing inputs
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, check again!",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        // Generate a token
        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // Fetch posts in a single query
        const populatedPosts = await Post.find({ _id: { $in: user.posts } })
            .populate({
                path: 'author',
                select: 'username profilePicture'
            });

        // Prepare the user object
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts // Optimized posts fetching
        };

        // Set the cookie and return the response
        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day expiration
        }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.error("Error in login controller:", error.message);
        return res.status(500).json({
            message: "An error occurred while logging in.",
            success: false
        });
    }
};



export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true
        })
    } catch (error) {
        console.log("error in logout controller", error.message);

    }
}

export const getProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      let user = await User.findById(userId)
        .populate({
          path: 'posts',
          options: { sort: { createdAt: -1 } }, // Sort posts by createdAt in descending order
        })
        .populate('bookmarks');
  
      return res.status(200).json({
        user,
        success: true,
      });
    } catch (error) {
      console.log("Error in getProfile controller:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

export const editProfile = async (req, res) => {
    try {
        const userId = req.id
        const { bio, gender } = req.body
        const profilePicture = req.file
        let cloudResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)

        }
        const user = await User.findById(userId).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        if (bio) {
            user.bio = bio
        }
        if (gender) {
            user.gender = gender
        }
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url
        }

        await user.save();

        return res.status(200).json({
            message: "profile updated",
            success: true,
            user
        })


    } catch (error) {
        console.log("error in editProfile controller", error.message);
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "currently do not have any users",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log("error in getSuggestedUser controller", error.message);
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id
        const jiskoFolloKarunga = req.params.id
        if (followKarneWala === jiskoFolloKarunga) {
            return res.status(400).json({
                message: "You can't follow/unfollow yourself",
                success: false,
            })
        }

        const user = await User.findById(followKarneWala)
        const targetUser = await User.findById(jiskoFolloKarunga)

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "user not found",
                success: false,
            })
        }

        const isFollowing = user.following.includes(jiskoFolloKarunga)
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskoFolloKarunga } }),
                User.updateOne({ _id: jiskoFolloKarunga }, { $pull: { followers: followKarneWala } })
            ])

            return res.status(200).json({
                message: "Unfollow successfully",
                success: true
            })
        } else {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: jiskoFolloKarunga } }),
                User.updateOne({ _id: jiskoFolloKarunga }, { $push: { followers: followKarneWala } })
            ])
            return res.status(200).json({
                message: "Followed successfully",
                success: true
            })
        }
    } catch (error) {
        console.log("error in followorunfollow controller", error.message);

    }
}
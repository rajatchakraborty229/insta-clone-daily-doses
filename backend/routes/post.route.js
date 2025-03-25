import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { addComment, addNewPost, bookMarkPost, deletePost, dislikedPost, getAllPost, getCommentsOfPost, getUserPost, likePost } from "../controllers/post.controller.js"
import upload from "../middlewares/multer.js"

const router=express.Router()

router.route('/add').post(isAuthenticated,upload.single('image'),addNewPost)
router.route('/all').get(isAuthenticated,getAllPost)
router.route('/userpost/all').post(isAuthenticated,getUserPost)
router.route('/:id/like').post(isAuthenticated,likePost)
router.route('/:id/dislike').post(isAuthenticated,dislikedPost)
router.route('/:id/comment').post(isAuthenticated,addComment)
router.route('/comment/all/:id').post(isAuthenticated,getCommentsOfPost)
router.route('/delete/:id').delete(isAuthenticated,deletePost)
router.route('/bookmark/:id').get(isAuthenticated,bookMarkPost)

export default router
import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { create, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";

const router=Router();

router.route('/create').post(verifyUser,create);
router.route('/getposts').get(getPosts);
router.route('/deletepost/:postId/:userId').delete(verifyUser, deletePost);
router.route('/updatepost/:postId/:userId').put(verifyUser, updatePost);

export {router as postRouter }
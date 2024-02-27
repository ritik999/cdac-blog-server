import { Router } from "express";
import { create } from "../controllers/comment.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { deletePostComments, editPostComments, getPostComments } from "../controllers/comment.controller.js";

const router=Router();

router.route('/create').post(verifyUser,create);
router.route('/getComments/:postId').get(getPostComments);
router.route('/edit/:commentId').put(verifyUser,editPostComments);
router.route('/delete/:commentId').delete(verifyUser,deletePostComments);

export {router as commentRouter};
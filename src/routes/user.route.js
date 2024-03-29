import { Router } from "express";
import { deleteUser, getUsers, google, loginUser, registerUser, signoutUser, testUser, updateUser } from "../controllers/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";


const router=Router();

router.route('/test').get(testUser);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/google').post(google);
router.route('/update/:id').put(verifyUser,updateUser);
router.route('/signout/:id').get(signoutUser);
router.route('/delete/:id').delete(verifyUser,deleteUser);
router.route('/getusers').get(verifyUser,getUsers);

export default router;

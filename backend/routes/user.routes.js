import { Router } from "express";
import authController from "../controllers/auth.controller.js";
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description User can  Login.
 * @access Public
 */
authRouter.post('/login', authController.loginUserController)


/**
 * @route GET /api/auth/logout
 * @description clear token cookies and add token to blacklist
 * @access Public
 */

authRouter.get('/logout', authController.logoutUserController)


/**
 * @route GET /api/auth/get-me
 * @description get the current user details
 * @access Private
 */

authRouter.get('/get-me', authController.getMeController)

export default authRouter;

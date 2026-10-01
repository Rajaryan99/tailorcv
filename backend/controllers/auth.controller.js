import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import blacklistModel from "../models/blacklist.model.js"

/**
 * @name registerUserController
 * @description To register new user and assign a JWT toekn in cookies
 * @access Public
 */

async function registerUserController(req, res) {

    try {

        const {username, email, password} = req.body

        if(!username || !email || !password){
            return res.status(400).json({Message: "Please fill all the fields username, email and password"})
        }

        const isUserAlreadyExist = await userModel.findOne({
            $or: [{username}, {email}]
        })

        if(isUserAlreadyExist){
            return res.status(400).json({message: "User already exist with this username or email."})
        }


        const hashPassword = await bcrypt.hash(password, 10)

        let user = await userModel.create({
            username,
            email, 
            password: hashPassword
        })


        const token = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        })


        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "internal server error"})
    }

}

/**
 * @name: loginUserController
 * @description login  a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req, res) {

    try {

        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({
                message: "Provide the required fields email and password"
            })
        }

    const user = await userModel.findOne({email}).select('+password')

    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)


    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {id: user._id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User logiedIn successfully.",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    })



        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Internal server error"
        })
    }

}


/**
 * @name logoutUserController
 * @description logout and clear token cookie and add to blacklist
 * @access Public
 */


async function logoutUserController(req, res){
    try {

        const token  = req.cookies.token;
        console.log(token)

        if(token){
            await blacklistModel.create({token})
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })

        
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Error while logging out user"
        })
    }
}


/**
 * @name getMeController
 * @description get the current user detaild
 * @access Private
 */

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ 
            message: "User details fetched successfully", 
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
         });
    } catch (error) {

         console.error(error)
        res.status(500).json({
            message:"Error while getting current user details:"
        })
        
    }
}

export default { registerUserController, loginUserController, logoutUserController, getMeController};

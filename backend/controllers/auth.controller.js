import userModel from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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


        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "internal server error"})
    }

}

export default { registerUserController };

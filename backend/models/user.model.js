import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 16

    },
    email: {
        type: String,
        unique: [true, "Account alreay exist with this email address"],
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
        },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false,
    },

    createdAt: {
        timestamps: true
    }


    
})

const userModel = mongoose.model("User", userSchema)
export default userModel;
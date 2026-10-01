import mongoose, { Schema } from "mongoose";

const blacklistModelSchema = new Schema({
    token: {
        type: String,
        required: [true, 'token is required ']
    }
}, {
    timestamps: true
})


const blacklistModel = mongoose.model('blacklistmodel', blacklistModelSchema)
export default blacklistModel;

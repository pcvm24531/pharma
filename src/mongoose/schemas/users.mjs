import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    nickName:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    birdDate: Date
});

export const User = mongoose.model("User", UserSchema);
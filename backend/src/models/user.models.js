import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:2
    },
    profilePic:{
        type:String,
        default:'https://res.cloudinary.com/diflkmo4w/image/upload/v1751727918/agtggnao5x1heivbsmsg.jpg'
    },
},{timestamps:true}
)
const UserModel = mongoose.model("User",userSchema)
export default UserModel 
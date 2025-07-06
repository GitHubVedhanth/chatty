import bcrypt from "bcryptjs" 
import { generatejwttoken } from "../utils/utils.js"
import UserModel from "../models/user.models.js"
import cloudinary from "../utils/cloudinary.utils.js"

export const signup =async (req,res)=>{
    try {
        const {fullname,email,password} = req.body
        if(!fullname ){
            return  res.send("no full name")
        }if(!password){
            return  res.send("no passowrd")
        }if(!email){
            return  res.send("no email")
        }
        if(password.length<2){
            return  res.status(400).json({message:"passowrd length less"})
        }

        const user = await UserModel.findOne({email});
        if(user){   
            return  res.status(400).json({message:"user already exists"})
        }
        const salt =await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password,salt)

        const newUser = new UserModel({
            fullname,
            email,
            password:hashedpassword
        })
        if(newUser){
            
            await newUser.save()
            generatejwttoken(newUser._id,res);
            return  res.status(201).json({message:"user saved sucessfully",data:newUser})


        }else{
            return  res.status(400).json({message:"neew User error"})
        }


    } catch (error) {
        console.log("error while signup controller",error.message)
        return res.status(500).json({ message: "Internal server error" });

    }
}

export const login = async (req,res)=>{
    try {
        
    const {email,password} = req.body

    const user = await UserModel.findOne({email})
    if(!user){
        return res.status(400).json({message:"no user found"})
    }

    const iscorrectpassword = await bcrypt.compare(password,user.password)
    if(iscorrectpassword){
        generatejwttoken(user._id,res)
        return res.status(200).json({message:"corect login credentitals",
            data:user
        })
    }else{
        return res.status(401).send("invalid credentitals")
    }
    } catch (error) {
         return res.status(401).send("error while logging in : ",error.message)
    }}

export const logout = (req,res)=>{
   
    res.clearCookie('jwt')
    return  res.json({message:"logout route"})
} 

export const profileUpdate=async (req,res)=>{
    try {
        const profilePic = req.file
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("File:", req.file);

        if(!profilePic){
            return  res.send("no profile pic")
        }
        const url = await cloudinary.uploader.upload(profilePic.path);
        // console.log(url);

        const imageUrl = url.secure_url;
        
        const userId = req.user._id
        const updateduser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: imageUrl },
        { new: true }
        );
        console.log("Updated User .......... ",updateduser)
        return res.status(201).send({updateduser})
    } catch (error) {
        return res.status(404).send({message:"not uploaded CLOUDINARY"+error})
    }
}

export const checkAuth = async(req,res)=>{
    try {
        
        return res.send(req.user)
    } catch (error) {
        return res.status(404).json({message:error})
    }
}
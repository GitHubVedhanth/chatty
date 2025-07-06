import jwt from "jsonwebtoken";
import UserModel from "../models/user.models.js";

export async function protectRoute(req,res,next) {
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).send("login to access this ")
        }
        const decoded = jwt.verify(token,process.env.JWT_TOKEN)
        if(!decoded){
            return res.send({message:"not correct jwt token"})
        }
        const user = await UserModel.findById(decoded.userid).select("-password")
        req.user=user
        next()

    } catch (error) {
        console.error(error.message)
        return res.send({message:error.message})
    }
}
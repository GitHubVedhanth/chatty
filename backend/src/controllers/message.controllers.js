import { getReceiverSocketId } from "../lib/socket.js"
import messageModel from "../models/message.models.js"
import UserModel from "../models/user.models.js"
import cloudinary from "../utils/cloudinary.utils.js"
import { io } from "../lib/socket.js"
export const getUsersForSideBar = async (req,res)=>{
    try {
        
        const user  = req.user._id
        const filterUsers = await UserModel.find( {_id:{$ne:user}}).select("-password")
        res.status(200).send(filterUsers)

    } catch (error) {
        console.error("Error in get user for side bar:", error.message);
        res.status(500).json({ message: "Error in get user for side bar", error: error.message });
    }
}

export const getMessages = async (req,res)=>{
    try {
        const user = req.user._id
        const {id:userToChatId} = req.params
        const messages = await messageModel.find({
            $or:[
                {senderId:user,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:user}
            ]
        })
        res.status(200).json({messages})
    } catch (error) {
        res.status(404).json({message:"error in get messages",error})
    }
}

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (req.file) {
      const cloudinary_response = await cloudinary.uploader.upload(req.file.path);
      imageUrl = cloudinary_response.secure_url;
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.status(200).json(newMessage); 
  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: "error in send Message", error });
  }
};

import mongoose from "mongoose";

export const connet_db = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
           
        console.log("mongo connected sucessfully ",conn.connection.host)
    } catch (error) {
        console.log("error while connecting db" ,error.message)
    }
}
import e from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controllers.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // learn more about it

const messagerouter = e.Router();

messagerouter.get('/users',protectRoute,getUsersForSideBar)
messagerouter.get('/:id',protectRoute,getMessages)
messagerouter.post('/send/:id',protectRoute,upload.single('image'),sendMessage)
export default messagerouter
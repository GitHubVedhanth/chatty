import e from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersForSideBar, sendMessage } from "../controllers/message.controllers.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // learn more about it

const messagerouter = e.Router();

messagerouter.get('/users',protectRoute,getUsersForSideBar)
messagerouter.post('/send/:id', protectRoute, upload.single('image'), (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Receiver ID is required' });
  }
  sendMessage(req, res, next);
});

messagerouter.get('/:id', protectRoute, (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  getMessages(req, res, next);
});

export default messagerouter
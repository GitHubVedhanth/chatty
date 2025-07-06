import e from "express";
import multer from "multer";
import { checkAuth, login, logout, profileUpdate, signup } from "../controllers/auth.contoller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const authrouter = e.Router();

const upload = multer({ dest: "uploads/" }); // learn more about it

authrouter.post('/signup', signup);
authrouter.post('/logout', logout);
authrouter.post('/login', login);
authrouter.post('/updateProfile',protectRoute,
  upload.single('profilePic'), // MUST be here for file parsing
  profileUpdate
);

authrouter.get('/check',protectRoute,checkAuth)

export { authrouter };

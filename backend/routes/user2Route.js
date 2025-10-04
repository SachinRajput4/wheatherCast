import express from "express";
import {loginUser,registerUser } from "../controllers/user2Controller.js";

const user2Router = express.Router();

user2Router.post("/register",registerUser);
user2Router.post("/login",loginUser);

export default user2Router;

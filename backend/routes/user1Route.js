import express from "express";
import {loginUser,registerUser } from "../controllers/user1Controller.js";

const user1Router = express.Router();

user1Router.post("/register",registerUser);
user1Router.post("/login",loginUser);

export default user1Router;

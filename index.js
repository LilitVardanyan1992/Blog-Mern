import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations/auth.js";
import checkAuth from "./utils/checkauth.js";
import * as UserContorller from "./controllers/userController.js";
import * as PostController from "./controllers/postController.js";

mongoose
    .connect(
        // "mongodb+srv://lvardanyan890:Pass321@cluster0.kzh9gml.mongodb.net/"
        "mongodb+srv://lvardanyan890:Pass321@cluster0.kzh9gml.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((err) => console.log(`DB error: ${err}`));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads");
    },
});

app.use(express.json());

app.post("/auth/login", loginValidation, UserContorller.login);
app.post("/auth/register", registerValidation, UserContorller.register);
app.get("/auth/me", checkAuth, UserContorller.getme);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
app.delete("/posts/:id", PostController.remove);
app.patch("/posts/:id", PostController.update);

app.listen(4445, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});

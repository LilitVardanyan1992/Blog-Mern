import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
    registerValidation,
    loginValidation,
    postCreateValidation,
} from "./validations/auth.js";
import checkAuth from "./utils/checkauth.js";
import { UserContorller, PostController } from "./controllers/index.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
    .connect(
        // "mongodb+srv://lvardanyan890:Pass321@cluster0.kzh9gml.mongodb.net/"
        "mongodb+srv://lvardanyan890:Pass321@cluster0.kzh9gml.mongodb.net/blog?retryWrites=true&w=majority"
    )
    .then(() => console.log("DB ok"))
    .catch((err) => console.log(`DB error: ${err}`));

const app = express();

const storage = multer.diskStorage({
    // diskStorage-ը թե որտեղ պահվի ու ինչ անուն նշանակվի նկարին, այդ настройка -  ն ա
    destination: (_, __, cb) => {
        // որտեղ պահպանել
        cb(null, "uploads");
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname); // ինչ անուն տեղադրվի
    },
});

const upload = multer({ storage }); // այս հատվածը կատարում է ֆայլի ներբեռնումը ու պահպանումը համապատասխան ֆոլդերում

app.use(express.json());
app.use("/uploads", express.static("uploads")); // այսինքն եթե գա req օկ http://localhost:4445/uploads/road-1072823_640.jpg հասցեով, ինքը գնա uploads folder ու գտնի

app.post(
    "/auth/login",
    loginValidation,
    handleValidationErrors,
    UserContorller.login
);
app.post(
    "/auth/register",
    registerValidation,
    handleValidationErrors,
    UserContorller.register
);
app.get("/auth/me", checkAuth, UserContorller.getme);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
    "/posts",
    checkAuth,
    postCreateValidation,
    handleValidationErrors,
    PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, postCreateValidation, PostController.update);

app.listen(4445, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModal from "../models/User.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModal({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can not register.",
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModal.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: "User didn't find." });
        }

        const isValidPass = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );

        if (!isValidPass) {
            return res.status(400).json({
                message: "Invalid login and password.",
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Can not authorize.",
        });
    }
};

export const getme = async (req, res) => {
    try {
        const user = await UserModal.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User didn't find,",
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({
            userData,
        });
    } catch (error) {
        return res.status(404).json({
            message: "net dostupa",
        });
    }
};

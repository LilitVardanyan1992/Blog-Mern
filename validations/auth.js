import { body } from "express-validator";

export const registerValidation = [
    body("email")
        .isEmail() // Check if the 'email' field is a valid email address.
        .withMessage("Please provide a valid email address"), // Custom error message.

    body("password")
        .isLength({ min: 5 }) // Ensure the 'password' has a minimum length of 5 characters.
        .withMessage("Password must be at least 5 characters long"), // Custom error message.

    body("fullName")
        .isLength({ min: 3 }) // Check if 'fullName' has a minimum length of 3 characters.
        .withMessage("Full name must be at least 3 characters long"), // Custom error message.

    body("avatarUrl")
        .optional() // 'avatarUrl' is optional, so it's not required.
        .isURL() // If provided, it should be a valid URL.
        .withMessage("Please provide a valid URL for the avatar"), // Custom error message.
];

export const loginValidation = [
    body("email")
        .isEmail() // Check if the 'email' field is a valid email address.
        .withMessage("Please provide a valid email address"), // Custom error message.

    body("password")
        .isLength({ min: 5 }) // Ensure the 'password' has a minimum length of 5 characters.
        .withMessage("Password must be at least 5 characters long"), // Custom error message.
];

export const postCreateValidation = [
    body("title")
        .isLength({ min: 3 })
        .isString()
        .withMessage("Please write title for article"), // Custom error messag
    body("text")
        .isLength({ min: 3 })
        .isString()
        .withMessage("Please write text for article"),
    body("tags").optional().isArray(),
    body("imageUrl")
        .optional()
        .isString()
        .withMessage("Please provide a valid URL for the image"),
];

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import validator from 'validator';

const { isEmail } = validator;


// LOGGING IN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const signupController = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the email is in the correct format
        if (!isEmail(email)) {
            return res.status(400).json({ msg: 'Invalid email format.' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: true, msg: "Email already exists." });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: true, msg: "Username already exists." });
        }

        if (password.length < 3)
            return res.status(400).json({ msg: "Password must have minimum 3 characters" });

        // If both email and username are unique, proceed with creating the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, username, password: hashedPassword });

        await newUser.save();

        // Generate token for the newly created user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        delete newUser.password;

        res.status(201).json({ token, user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

};
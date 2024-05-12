import express from 'express'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//middlewares
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(cors());

//routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

app.use(express.static(path.join(__dirname, 'client')));

// Route to serve the signup.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'signup', 'signup.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'login', 'login.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'note', 'note.html'));
});
app.get('/trashed-notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'trashed', 'trashed-notes.html'));
});
app.get('/archived-notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'archive', 'archived-notes.html'));
});

const PORT = process.env.PORT || 6000;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect`));
import express from 'express'
import { addNoteController, editNoteController, getAllNoteController, deleteNoteController, getOneNoteController, archiveNoteController } from '../controllers/noteController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post("/addnote", verifyToken, addNoteController);
router.put("/editnote/:noteId", verifyToken, editNoteController);
router.put("/archivenote/:noteId", verifyToken, archiveNoteController);
router.get("/get-one-note/:noteId", verifyToken, getOneNoteController);
router.get("/get-all-notes", verifyToken, getAllNoteController);
router.delete("/deletenote/:noteId", verifyToken, deleteNoteController);

export default router;
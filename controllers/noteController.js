import Note from '../models/Note.js'


//add notes
export const addNoteController = async (req, res) => {
    const { title, content, labels } = req.body;
    const user = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }

    try {
        const note = new Note({
            title,
            content,
            labels: labels || [],
            userId: user.id,
        })

        await note.save();
        return res.status(201).json({
            error: false,
            note,
            message: "Note added successfully!"
        })
    }
    catch (err) {
        return res.status(501).json({
            error: true,
            message: "Internal Server Error!",
            err
        })
    }
}

//update notes
export const editNoteController = async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, labels } = req.body;
    const user = req.user;
    if (!title && !content) {
        return res.status(400).json({
            error: true,
            message: "No changes provided"
        })
    }
    try {
        const note = await Note.findOne({ _id: noteId, userId: user.id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }
        note.title = title;
        note.content = content;
        note.labels = labels;
        await note.save();
        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
}

export const getOneNoteController = async (req, res) => {
    try {
        const noteId = req.params.noteId;
        const user = req.user;
        const note = await Note.findOne({ _id: noteId, userId: user.id });
        if (!note) {
            return res.send(401).json({
                error: true,
                message: "note is not found"
            })
        }
        return res.status(200).json({
            note
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }

}

//delete notes
export const deleteNoteController = async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user.id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }
        note.isTrashed = !note.isTrashed;
        await note.save();
        return res.json({
            error: false,
            message: "Note moved to trashed successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
}

export const archiveNoteController = async (req, res) => {
    const noteId = req.params.noteId;
    const user = req.user;
    try {
        const note = await Note.findOne({ _id: noteId, userId: user.id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }
        note.isArchived = !note.isArchived;
        await note.save();
        return res.json({
            error: false,
            message: "Note moved to trashed successfully"
        })
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
}

//get all notes
export const getAllNoteController = async (req, res) => {
    const user = req.user;

    try {
        const notes = await Note.find({ userId: user.id });
        return res.status(200).json({
            error: false,
            message: "Received all notes successfully",
            notes
        })
    } catch (error) {
        return res.status(500).json({
            erro: true,
            message: "Internal server error"
        });
    }
}
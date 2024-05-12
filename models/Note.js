import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        labels: { type: [String], default: [] },
        backgroundColor: { type: String, default: "" },
        userId: { type: String, required: true },
        createnOn: { type: Date, default: new Date().getTime() },
        isArchived: { type: Boolean, default: false },
        isTrashed: { type: Boolean, default: false },
    }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
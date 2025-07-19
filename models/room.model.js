import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Room", roomSchema);
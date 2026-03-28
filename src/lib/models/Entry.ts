import mongoose, { Schema, models } from "mongoose";

const EntrySchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: "",
        },
        content: {
            type: String,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Entry = models.Entry || mongoose.model("Entry", EntrySchema);
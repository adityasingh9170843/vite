import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "analyst"],
            default: "admin",
        },
    },
    {
        timestamps: true,
    }
);

export const UserModel = mongoose.model("User", UserSchema);

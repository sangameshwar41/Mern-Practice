const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            unique: true
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        // Task 11: User role and permissions
        role: {
            type: String,
            enum: ["admin", "staff", "viewer"],
            default: "viewer",
            required: true
        },

        resetPasswordToken: {
            type: String,
            select: false
        },

        resetPasswordExpires: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
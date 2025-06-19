import mongoose from "mongoose";
import "dotenv/config";
import tripleDES from "../crypto/TripleDES.js";

// Use tripleDES.encrypt and tripleDES.decrypt directly
const userSchema = new mongoose.Schema(
    {
        fullName: {
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
            minlength: 6,
        },
        bio: {
            type: String,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        },
        nativeLanguage: {
            type: String,
            default: "",
        },
        learningLanguage: {
            type: String,
            default: "",
        },
        location: {
            type: String,
            default: "",
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            const key1 = process.env.TRIPLE_DES_KEY1;
            const key2 = process.env.TRIPLE_DES_KEY2;
            const key3 = process.env.TRIPLE_DES_KEY3 || key1;

            if (!key1 || !key2) {
                throw new Error("Triple DES keys are not defined in environment variables");
            }

            this.password = tripleDES.encrypt(this.password, key1, key2, key3);
        } catch (error) {
            return next(error);
        }
    }
    next();
});

userSchema.methods.getDecryptedPassword = function () {
    const key1 = process.env.TRIPLE_DES_KEY1;
    const key2 = process.env.TRIPLE_DES_KEY2;
    const key3 = process.env.TRIPLE_DES_KEY3 || key1;

    if (!key1 || !key2) {
        throw new Error("Triple DES keys are not defined in environment variables");
    }

    return tripleDES.decrypt(this.password, key1, key2, key3);
};

const User = mongoose.model("User", userSchema);
export default User;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    medicalId: String // Optional for non-medical users
});
// Hash password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Check if the User model is already compiled, if not define it
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

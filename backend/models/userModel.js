const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    image: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'instructor'],
        default: 'user'
    },
    verifyOtp: {
        type: Number,
        default: ''
    },
    verifyOtpExpired: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: Number,
        default: ''
    },
    resetOtpExpired: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model("users", userModel)
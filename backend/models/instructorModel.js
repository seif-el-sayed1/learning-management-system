const mongoose = require('mongoose');
const User = require('./userModel');
const Course = require('./courseModel');

const instructorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructorCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    totalEarnings: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Instructor', instructorSchema);

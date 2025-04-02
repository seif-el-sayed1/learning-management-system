const mongoose = require('mongoose');
const User = require('./userModel');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

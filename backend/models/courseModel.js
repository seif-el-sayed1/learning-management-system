const mongoose = require('mongoose');
const User = require('./userModel');

const courseSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        }
    }],
    chapters: [{
        title: {
            type: String,
            required: true
        },
        url: [{
            link: {
                type: String,
                required: true
            },
            isFree: {
                type: Boolean,
                default: false
            }
        }],
        duration: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,   
        default: Date.now
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

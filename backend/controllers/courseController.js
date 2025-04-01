const Course = require("../models/courseModel")
const User = require("../models/userModel")

const addCourse = async (req, res) => {
    const { name, description, price, chapters } = req.body

    const instructor = await User.findById(req.user.id)
    if (!instructor || instructor.role !== "instructor") {
        return res.status(400).json({
            success: false,
            message: "Instructor not found"
        })
    }
    if (!name || !description || !price || !chapters || !Array.isArray(chapters)) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields: name, description, price, and chapters"
        });
    }
    chapters.forEach((chapter) => {
        const { title, url, isFree, duration } = chapter;
        if (!title || !Array.isArray(url) || url.length === 0 || typeof isFree !== 'boolean' || !duration) {
            return res.status(400).json({
                success: false,
                message: "Chapter Invalid"
            });
        }
    });

    try {
        const newCourse  = await new Course({
            image: req.image,
            name,
            description,
            price,
            instructor: req.user.id,
            chapters,
        })
        await newCourse.save()
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { 
    addCourse
}

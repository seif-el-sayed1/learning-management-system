const Course = require("../models/courseModel")
const User = require("../models/userModel")
const Student = require("../models/studentModel")
const Instructor = require("../models/instructorModel")

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
        return res.status(400).json({ success: false, 
            message: "Please provide all required fields: name, description, price, and chapters"});
    }
    chapters.forEach((chapter) => {
        const { title, url, isFree, duration } = chapter;
        if (!title || !Array.isArray(url) || url.length === 0 || typeof isFree !== 'boolean' || !duration) {
            return res.status(400).json({ success: false,message: "Chapter Invalid"});
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
        return res.status(201).json({success: true, message: "Course created successfully",data: newCourse})
    } catch (error) {
        return res.status(400).json({success: false,message: error.message})
    }
}
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        return res.status(200).json({success: true, message: "Courses fetched successfully", data: courses})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}
const getCourseById = async (req, res) => {
    const {courseId} = req.params
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({success: false,message: "Course not found"})
        }
        return res.status(200).json({success: true, message: "Course fetched successfully", data: course})
    } catch (error) {
        return res.status(400).json({success: false,message: error.message})
    }
}
const enrollCourse = async (req, res) => {
    
    try {
        const {courseId} = req.body
        const student = await Student.findById(req.user.id)
        if (!student) {
            return res.status(404).json({success: false,message: "Student not found"})
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({success: false,message: "Course not found"})
        }
        if (student.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ success: false, message: "You are already enrolled in this course" });
        }

        student.enrolledCourses.push(courseId)
        await student.save()

        const instructor = await Instructor.findById(course.instructor)
        instructor.students.push(req.user.id)
        await instructor.save() 

        course.students.push(req.user.id)
        await course.save()
        
        return res.status(200).json({success: true, message: "Course enrolled successfully"})
    } catch (error) {
        return res.status(400).json({success: false,message: error.message})
    }
}   
const getEnrolledCourses = async (req, res) => {
    const student = await Student.findById(req.user.id).populate('enrolledCourses')
    if (!student) {
        return res.status(404).json({success: false,message: "Student not found"})
    }
    return res.status(200).json({success: true, message: "Enrolled courses fetched successfully", data: student.enrolledCourses})
}   
const addRating = async (req, res) => {
    try {
        const { rating } = req.body;  
        const courseId = req.params.courseId;  

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 0 and 5' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const existingRatingIndex = course.ratings.findIndex(r => r.user.toString() === req.user.id.toString());

        if (existingRatingIndex >= 0) {
            course.ratings[existingRatingIndex].rating = rating;
        } else {
            course.ratings.push({ user: req.user.id, rating });
        }

        const totalRatings = course.ratings.length;
        const sumRatings = course.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        course.rating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        await course.save();

        return res.status(200).json({
            success: true,
            message: 'Rating added successfully',
            course: {
                _id: course._id,
                name: course.name,
                rating: course.rating,
                totalRatings: course.ratings.length
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error adding rating', error: error.message });
    }
};

const getRatings = async (req, res) => {
    try {
        const courseId = req.params.courseId;  
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (course.ratings.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No ratings yet for this course',
                rating: 0,
                totalRatings: 0
            });
        }

        return res.status(200).json({
            success: true,
            rating: course.rating,
            totalRatings: course.ratings.length
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error fetching ratings', error: error.message });
    }
};

const getStudentRatings = async (req, res) => {
    try {
        const courseId = req.params.courseId;  
        const course = await Course.findById(courseId).populate('ratings.user', 'name email');

        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: 'Course not found' 
            });
        }

        const studentRatings = course.ratings.map(rating => ({
            student: {
                id: rating.user._id,
                name: rating.user.name,
                email: rating.user.email
            },
            rating: rating.rating
        }));

        return res.status(200).json({
            success: true,
            message: 'Student ratings fetched successfully',
            data: {
                courseId: course._id,
                courseName: course.name,
                totalRatings: course.ratings.length,
                averageRating: course.rating,
                studentRatings
            }
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Error fetching student ratings', 
            error: error.message 
        });
    }
};


module.exports = { 
    addCourse,
    getAllCourses,
    getCourseById,
    enrollCourse,
    getEnrolledCourses,
    addRating,
    getRatings,
    getStudentRatings
}

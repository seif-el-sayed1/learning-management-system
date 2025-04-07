const express = require("express")
const router = express.Router()
const setFileUrl = require("../middlewares/setFileUrl")
const courseController = require("../controllers/courseController")
const verifyToken = require("../middlewares/verifyToken")

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `food-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})
const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if(imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', 400), false)
    }
}
const upload = multer({ 
    storage: diskStorage,
    fileFilter
})

//instructor routes
router.route('/add-course').post(upload.single('image'), setFileUrl, courseController.addCourse)
router.route('/get-all-courses').get(courseController.getAllCourses)
router.route('/get-course/:courseId').get(courseController.getCourseById)

//student routes
router.route('/enroll-course/:courseId').post(verifyToken, courseController.enrollCourse)
router.route('/get-enrolled-courses').get(verifyToken, courseController.getEnrolledCourses)

router.route('/add-rating/:courseId').post(verifyToken, courseController.addRating)
router.route('/get-ratings/:courseId').get(verifyToken, courseController.getRatings)
router.route('/get-student-ratings/:courseId').get(verifyToken, courseController.getStudentRatings)

router.route('/search-courses').get(courseController.getCourseBySearch) 

module.exports = router

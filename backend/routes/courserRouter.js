const express = require("express")
const router = express.Router()
const setFileUrl = require("../middlewares/setFileUrl")
const courseController = require("../controllers/courseController")

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

router.route('/add-course').post(upload.single('image'), setFileUrl, courseController.addCourse)

module.exports = router

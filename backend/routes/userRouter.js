const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyToken = require("../middlewares/verifyToken")
const setFileUrl = require("../middlewares/setFileUrl")

const multer = require('multer')

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




router.route('/register').post(upload.single('image'), setFileUrl, userController.register)

router.route('/login').post(userController.login)

router.route('/logout').post(userController.logout)

router.route('/send-verify-otp').post(verifyToken, userController.sendVerifyOtp)
router.route('/verify-email').post(verifyToken, userController.verifyEmail)

router.route('/send-reset-otp').post(userController.sendResetOtp)
router.route('/reset-password').post(userController.resetPassword)

router.route('/user').get(verifyToken, userController.userData)

router.route('/is-auth').get(verifyToken, userController.isAuthenticated)


module.exports = router;
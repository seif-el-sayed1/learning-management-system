const setFileUrl = async (req, res, next) => {
    if (!req.file) {
        return res.status(404).json({success: false, message: "enter the Image of the food"})
    }
    req.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    next();
    
}
module.exports = setFileUrl;
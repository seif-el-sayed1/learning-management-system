const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.json({ Success: false, message: "Please Login First" });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user;
        
        next();
    } catch (error) {
        return res.json({ Success: false, message: "Invalid Token" });
    }
};

module.exports = verifyToken;

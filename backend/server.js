const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const courseRouter = require('./routes/courserRouter');

app.use(express.json());
const allowedOrigins = ["http://localhost:5173"] 
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.use(cookieParser())

app.use("/api/users", userRouter)
app.use("/api/courses", courseRouter)


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    })


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

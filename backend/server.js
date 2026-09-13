const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const db = require("./database/database");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postroutes");
const likeRoutes =require("./routes/likeroutes");
const commentRoutes = require("./routes/commentroutes");
const notificationRoutes =require("./routes/notificationroutes");
const userRoutes = require("./routes/userroutes");
require("./models/user");
require("./models/post");
require("./models/like");
require("./models/Comment");
require("./models/notification");
const app = express();

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users",userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AnimeHub backend is running!"
    });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`AnimeHub server running on port ${PORT}`);
});
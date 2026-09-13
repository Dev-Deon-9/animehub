const express = require("express");

const {
    createPost,
    getPosts,
    deletePost,
    updatePost
} = require("../controllers/postcontroller");

const upload = require("../middleware/uploadMiddleware");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    upload.single("media"),
    createPost
);

router.get("/", authenticateToken, getPosts);

router.delete("/:id", authenticateToken, deletePost);

router.put("/:id", authenticateToken, updatePost);

module.exports = router;
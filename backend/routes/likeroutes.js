const express = require("express");

const {
    toggleLike,
    getLikeStatus
} = require("../controllers/likecontroller");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


// Like / Unlike

router.post(
    "/:id",
    authenticateToken,
    toggleLike,
    getLikeStatus
);


module.exports = router;
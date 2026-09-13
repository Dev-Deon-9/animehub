const express = require("express");

const {
    createComment,
    getComments
} = require("../controllers/commentcontroller");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// CREATE COMMENT
// =========================

router.post(
    "/:id",
    authenticateToken,
    createComment
);


// =========================
// GET COMMENTS
// =========================

router.get(
    "/:id",
    authenticateToken,
    getComments
);


module.exports = router;
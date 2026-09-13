const express = require("express");

const {
    getUserProfile
} = require("../controllers/usercontroller");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


// =========================
// GET USER PROFILE
// =========================

router.get(
    "/:id",
    authenticateToken,
    getUserProfile
);


module.exports = router;
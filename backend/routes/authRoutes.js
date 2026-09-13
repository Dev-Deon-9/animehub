const express = require("express");

const { loginUser } = require("../controllers/authController");
const { signupUser } = require("../controllers/signupController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);

// Protected test route
router.get("/me", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "Authentication successful!",
        userId: req.user.userId
    });
});

module.exports = router;
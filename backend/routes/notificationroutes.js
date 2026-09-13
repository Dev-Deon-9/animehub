const express = require("express");

const {
    getNotifications,
    markNotificationRead,
    getUnreadCount
} = require("../controllers/notificationcontroller");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/unread-count",
    authenticateToken,
    getUnreadCount
);

router.get(
    "/",
    authenticateToken,
    getNotifications
);


router.post(
    "/:id/read",
    authenticateToken,
    markNotificationRead
);


module.exports = router;
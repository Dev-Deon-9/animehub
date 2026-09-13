const db = require("../database/database");


// GET USER NOTIFICATIONS
const getNotifications = (req, res) => {
    try {

        const userId = req.user.userId;

        const notifications = db.prepare(`
            SELECT
                notifications.id,
                notifications.type,
                notifications.post_id,
                notifications.comment_id,
                notifications.is_read,
                notifications.created_at,

                sender.id AS sender_id,
                sender.username AS sender_username,
                sender.profile_picture AS sender_profile_picture,

                posts.content AS post_content,

                comments.content AS comment_content

            FROM notifications

            JOIN users AS sender
                ON notifications.sender_id = sender.id

            LEFT JOIN posts
                ON notifications.post_id = posts.id

            LEFT JOIN comments
                ON notifications.comment_id = comments.id

            WHERE notifications.user_id = ?

            ORDER BY notifications.created_at DESC

        `).all(userId);


        res.json({
            success: true,
            notifications
        });


    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};



// MARK NOTIFICATION AS READ
const markNotificationRead = (req, res) => {
    try {

        const notificationId =
            req.params.id;

        const userId =
            req.user.userId;


        const result = db.prepare(`
            UPDATE notifications

            SET is_read = 1

            WHERE id = ?

            AND user_id = ?

        `).run(
            notificationId,
            userId
        );


        if (result.changes === 0) {

            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });

        }


        res.json({
            success: true,
            message: "Notification marked as read"
        });


    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};
// =========================================
// GET UNREAD NOTIFICATION COUNT
// =========================================

const getUnreadCount = (req, res) => {

    try {

        const userId = req.user.userId;

        const result = db.prepare(`
            SELECT COUNT(*) AS count
            FROM notifications
            WHERE user_id = ?
            AND is_read = 0
        `).get(userId);

        res.json({
            success: true,
            count: result.count
        });

    } catch (error) {

        console.error(
            "Get unread notification count error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};

module.exports = {
    getNotifications,
    markNotificationRead,
    getUnreadCount
};
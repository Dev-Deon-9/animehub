const db = require("../database/database");


// =========================
// LIKE / UNLIKE POST
// =========================

const toggleLike = (req, res) => {

    try {

        const postId = req.params.id;
        const userId = req.user.userId;


        // =========================
        // CHECK IF POST EXISTS
        // =========================

        const post = db.prepare(`
            SELECT id, user_id
            FROM posts
            WHERE id = ?
        `).get(postId);


        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }


        // =========================
        // CHECK EXISTING LIKE
        // =========================

        const existingLike = db.prepare(`
            SELECT id
            FROM likes
            WHERE user_id = ?
            AND post_id = ?
        `).get(userId, postId);


        // =========================
        // UNLIKE
        // =========================

        if (existingLike) {

            db.prepare(`
                DELETE FROM likes
                WHERE user_id = ?
                AND post_id = ?
            `).run(
                userId,
                postId
            );


            const likeCount = db.prepare(`
                SELECT COUNT(*) AS count
                FROM likes
                WHERE post_id = ?
            `).get(postId);


            return res.json({
                success: true,
                liked: false,
                likeCount: likeCount.count,
                message: "Post unliked"
            });

        }


        // =========================
        // LIKE
        // =========================

        db.prepare(`
            INSERT INTO likes (user_id, post_id)
            VALUES (?, ?)
        `).run(
            userId,
            postId
        );


        // =========================
        // CREATE NOTIFICATION
        // =========================

        // Don't notify someone when they like
        // their own post.

        if (post.user_id !== userId) {

            db.prepare(`
                INSERT INTO notifications
                (
                    user_id,
                    sender_id,
                    type,
                    post_id
                )
                VALUES (?, ?, ?, ?)
            `).run(
                post.user_id,
                userId,
                "like",
                postId
            );

        }


        // =========================
        // GET LIKE COUNT
        // =========================

        const likeCount = db.prepare(`
            SELECT COUNT(*) AS count
            FROM likes
            WHERE post_id = ?
        `).get(postId);


        res.json({
            success: true,
            liked: true,
            likeCount: likeCount.count,
            message: "Post liked"
        });


    } catch (error) {

        console.error(
            "Toggle like error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};

// =========================
// GET LIKE STATUS
// =========================

const getLikeStatus = (req, res) => {

    try {

        const postId = req.params.id;
        const userId = req.user.userId;


        // Check if post exists

        const post = db.prepare(`
            SELECT id
            FROM posts
            WHERE id = ?
        `).get(postId);


        if (!post) {

            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        }


        // Check if current user liked the post

        const existingLike = db.prepare(`
            SELECT id
            FROM likes
            WHERE user_id = ?
            AND post_id = ?
        `).get(userId, postId);


        // Get total likes

        const likeCount = db.prepare(`
            SELECT COUNT(*) AS count
            FROM likes
            WHERE post_id = ?
        `).get(postId);


        res.json({
            success: true,
            liked: !!existingLike,
            likeCount: likeCount.count
        });


    } catch (error) {

        console.error(
            "Get like status error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


module.exports = {
    toggleLike,
    getLikeStatus
};
const db = require("../database/database");


// =========================
// CREATE COMMENT
// =========================
// =========================
// CREATE COMMENT
// =========================

const createComment = (req, res) => {

    try {

        const postId = req.params.id;
        const userId = req.user.userId;
        const { content } = req.body;


        // Check comment content

        if (!content || !content.trim()) {

            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty"
            });

        }


        // Check if post exists
        // We also get the post owner's user ID

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


        // Create comment

        const result = db.prepare(`
            INSERT INTO comments (
                user_id,
                post_id,
                content
            )
            VALUES (?, ?, ?)
        `).run(
            userId,
            postId,
            content.trim()
        );


        // =========================
        // CREATE NOTIFICATION
        // =========================

        if (post.user_id !== userId) {

            db.prepare(`
                INSERT INTO notifications (
                    user_id,
                    sender_id,
                    type,
                    post_id,
                    comment_id
                )
                VALUES (?, ?, ?, ?, ?)
            `).run(
                post.user_id,
                userId,
                "comment",
                postId,
                result.lastInsertRowid
            );

        }


        // Get created comment with user information

        const comment = db.prepare(`
            SELECT
                comments.id,
                comments.user_id,
                comments.post_id,
                comments.content,
                comments.created_at,
                users.username,
                users.profile_picture
            FROM comments

            JOIN users
            ON comments.user_id = users.id

            WHERE comments.id = ?
        `).get(result.lastInsertRowid);


        res.status(201).json({

            success: true,

            message: "Comment created successfully",

            comment

        });


    } catch (error) {

        console.error(
            "Create comment error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


// =========================
// GET COMMENTS
// =========================

const getComments = (req, res) => {

    try {

        const postId = req.params.id;


        // Check if post exists

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


        // Get comments

        const comments = db.prepare(`
            SELECT
                comments.id,
                comments.user_id,
                comments.post_id,
                comments.content,
                comments.created_at,
                users.username,
                users.profile_picture
            FROM comments

            JOIN users
            ON comments.user_id = users.id

            WHERE comments.post_id = ?

            ORDER BY comments.created_at ASC

        `).all(postId);


        res.json({

            success: true,

            comments

        });


    } catch (error) {

        console.error(
            "Get comments error:",
            error
        );


        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

};


module.exports = {

    createComment,
    getComments

};
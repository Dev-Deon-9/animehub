const db = require("../database/database");

const createPost = (req, res) => {
    try {
        const content =
    req.body.content;

const media =
    req.file;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required"
            });
        }

        const mediaUrl =
    media
        ? `/uploads/${media.filename}`
        : "";

const result = db.prepare(`
    INSERT INTO posts (user_id, content, image)
    VALUES (?, ?, ?)
`).run(
    req.user.userId,
    content.trim(),
    mediaUrl
);

        const post = db.prepare(`
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.image,
                posts.created_at,
                users.username,
                users.profile_picture
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getPosts = (req, res) => {
    try {

        const posts = db.prepare(`
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.image,
                posts.created_at,
                users.username,
                users.profile_picture,

                (
                    SELECT COUNT(*)
                    FROM likes
                    WHERE likes.post_id = posts.id
                ) AS like_count,

                EXISTS (
                    SELECT 1
                    FROM likes
                    WHERE likes.post_id = posts.id
                    AND likes.user_id = ?
                ) AS liked

            FROM posts

            JOIN users
            ON posts.user_id = users.id

            ORDER BY posts.created_at DESC

        `).all(req.user.userId);


        res.json({
            success: true,
            posts
        });


    } catch (error) {

        console.error(
            "Get posts error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }
};

const deletePost = (req, res) => {
    try {
        const postId = req.params.id;

        // Check if the post exists
        const post = db.prepare(`
            SELECT *
            FROM posts
            WHERE id = ?
        `).get(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Make sure the logged-in user owns the post
        if (post.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });
        }

        db.prepare(`
            DELETE FROM posts
            WHERE id = ?
        `).run(postId);

        res.json({
            success: true,
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const updatePost = (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required"
            });
        }

        const post = db.prepare(`
            SELECT *
            FROM posts
            WHERE id = ?
        `).get(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        if (post.user_id !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You can only edit your own posts"
            });
        }

        db.prepare(`
            UPDATE posts
            SET content = ?
            WHERE id = ?
        `).run(
            content.trim(),
            postId
        );

        const updatedPost = db.prepare(`
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.image,
                posts.created_at,
                users.username,
                users.profile_picture
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE posts.id = ?
        `).get(postId);

        res.json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });

    } catch (error) {
        console.error("Update post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
    updatePost
};
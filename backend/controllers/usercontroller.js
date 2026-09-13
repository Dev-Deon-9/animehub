const db = require("../database/database");


// =========================
// GET USER PROFILE
// =========================

const getUserProfile = (req, res) => {

    try {

        const userId = req.params.id;


        // Get user information

        const user = db.prepare(`
            SELECT
                id,
                username,
                email,
                profile_picture,
                bio,
                created_at
            FROM users
            WHERE id = ?
        `).get(userId);


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        // Get user's posts

        const posts = db.prepare(`
            SELECT
                posts.id,
                posts.user_id,
                posts.content,
                posts.image,
                posts.created_at,

                (
                    SELECT COUNT(*)
                    FROM likes
                    WHERE likes.post_id = posts.id
                ) AS like_count

            FROM posts

            WHERE posts.user_id = ?

            ORDER BY posts.created_at DESC

        `).all(userId);


        res.json({

            success: true,

            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                profilePicture: user.profile_picture,
                bio: user.bio,
                createdAt: user.created_at
            },

            posts

        });


    } catch (error) {

        console.error(
            "Get user profile error:",
            error
        );


        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

};


module.exports = {
    getUserProfile
};
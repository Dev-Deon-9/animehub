const db = require("../database/database");

db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        user_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,

        type TEXT NOT NULL,

        post_id INTEGER,

        comment_id INTEGER,

        is_read INTEGER DEFAULT 0,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

        FOREIGN KEY (sender_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,

        FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE
    )
`);

console.log("Notifications table ready");

module.exports = db;
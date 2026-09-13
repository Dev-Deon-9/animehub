const Database = require("better-sqlite3");

const db = new Database("./database/animehub.db");

db.pragma("journal_mode = WAL");

console.log("AnimeHub SQLite database connected successfully");

module.exports = db;
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            path.join(
                __dirname,
                "../uploads"
            )
        );

    },

    filename: (req, file, cb) => {

        const extension =
            path.extname(file.originalname);

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1E9
            ) +
            extension;

        cb(
            null,
            uniqueName
        );

    }

});

const upload = multer({

    storage: storage,

    limits: {
        fileSize: 50 * 1024 * 1024
    },

    fileFilter: (
        req,
        file,
        cb
    ) => {

        const allowedTypes = [
            "image/",
            "video/"
        ];

        const isAllowed =
            allowedTypes.some(
                (type) =>
                    file.mimetype.startsWith(type)
            );

        if (isAllowed) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only image and video files are allowed."
                )
            );

        }

    }

});

module.exports = upload;
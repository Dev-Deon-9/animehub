
// =========================
// COMMENT PAGE
// =========================

const token =
    localStorage.getItem("animehub_token");

const savedUser =
    localStorage.getItem("animehub_user");


// =========================
// AUTH CHECK
// =========================

if (!token || !savedUser) {

    window.location.href =
        "./login.html";

}


// =========================
// GET LOGGED-IN USER
// =========================

const user =
    JSON.parse(savedUser);


// =========================
// GET POST ID FROM URL
// =========================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const postId =
    urlParams.get("postId");


    // =========================
// LOAD SELECTED POST
// =========================

async function loadPost() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/posts",
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            console.error(
                "Failed to load posts"
            );

            return;
        }


        const post =
            data.posts.find(
                (item) =>
                    String(item.id) ===
                    String(postId)
            );


        if (!post) {

            alert(
                "This post could not be found."
            );

            window.location.href =
                "./index.html";

            return;
        }


        // Username

        const username =
            document.getElementById(
                "comment-post-username"
            );


        if (username) {

            username.textContent =
                post.username;

        }


        // Meta

        const meta =
            document.getElementById(
                "comment-post-meta"
            );


        if (meta) {

            meta.textContent =
                `@${post.username} · ${post.created_at}`;

        }


        // Post content

        const content =
            document.getElementById(
                "comment-post-content"
            );


        if (content) {

            content.textContent =
                post.content;

        }
       const imageContainer =
    document.getElementById(
        "comment-post-image-container"
    );

if (post.image) {

    imageContainer.style.display = "block";

    const mediaUrl =
        "http://localhost:5000" + post.image;

    if (
        /\.(mp4|webm|ogg|mov)$/i.test(
            post.image
        )
    ) {

        imageContainer.innerHTML = `
            <video
                src="${mediaUrl}"
                controls
                class="comment-post-media"
            ></video>
        `;

    } else {

        imageContainer.innerHTML = `
            <img
                src="${mediaUrl}"
                alt="Post media"
                class="comment-post-media"
            >
        `;

    }

} else {

    imageContainer.style.display = "none";

}
} catch (error) { console.error( "Load post error:", error ); }
}

// =========================
// LIKE SELECTED POST
// =========================

const likeButton =
    document.getElementById(
        "comment-like-btn"
    );

const likeCount =
    document.getElementById(
        "comment-like-count"
    );

async function loadLikeStatus() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/likes/${postId}`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            return;
        }

        likeCount.textContent =
            data.likeCount;

        if (data.liked) {
            likeButton.classList.add("liked");
        } else {
            likeButton.classList.remove("liked");
        }

    } catch (error) {

        console.error(
            "Load like status error:",
            error
        );

    }
}

if (likeButton) {

    likeButton.addEventListener(
        "click",
        async () => {

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/likes/${postId}`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok ||
                    !data.success) {
                    return;
                }

                likeCount.textContent =
                    data.likeCount;

                if (data.liked) {
                    likeButton.classList.add("liked");
                } else {
                    likeButton.classList.remove("liked");
                }

            } catch (error) {

                console.error(
                    "Toggle like error:",
                    error
                );

            }

        }
    );

}


if (!postId) {

    alert("Post not found.");

    window.location.href =
        "./index.html";

}



// =========================
// ELEMENTS
// =========================

const commentsList =
    document.querySelector(
        ".comments-list"
    );

const commentInput =
    document.querySelector(
        ".write-comment input"
    );

const commentSubmit =
    document.querySelector(
        ".comment-submit"
    );


// =========================
// LOAD COMMENTS
// =========================

async function loadComments() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/comments/${postId}`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            commentsList.innerHTML = `
                <p class="comments-empty">
                    Unable to load comments.
                </p>
            `;

            return;
        }


        commentsList.innerHTML = "";


        // No comments

        if (data.comments.length === 0) {

            commentsList.innerHTML = `
                <p class="comments-empty">
                    No comments yet. Be the first!
                </p>
            `;

            updateCommentCount(0);

            return;
        }


        // Display comments

        data.comments.forEach(
            (comment) => {

                displayComment(comment);

            }
        );


        updateCommentCount(
            data.comments.length
        );


    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );

        commentsList.innerHTML = `
            <p class="comments-empty">
                Unable to connect to AnimeHub server.
            </p>
        `;

    }

}


// =========================
// DISPLAY COMMENT
// =========================

function displayComment(comment) {

    const commentElement =
        document.createElement(
            "article"
        );


    commentElement.className =
        "comment";


    const avatar =
        comment.username
            .charAt(0)
            .toUpperCase();


    commentElement.innerHTML = `

        <div class="comment-avatar">
            ${avatar}
        </div>


        <div class="comment-body">

            <div class="comment-meta">

                <strong>
                    ${comment.username}
                </strong>

                <span>
                    @${comment.username}
                    ·
                    ${formatCommentTime(
                        comment.created_at
                    )}
                </span>

            </div>


            <p>
                ${escapeHtml(
                    comment.content
                )}
            </p>


            <div class="comment-actions">

                <button>
                    ♡ 0
                </button>

                <button>
                    Reply
                </button>

                <button>
                    •••
                </button>

            </div>

        </div>

    `;


    commentsList.appendChild(
        commentElement
    );

}


// =========================
// SUBMIT COMMENT
// =========================

if (commentSubmit) {

    commentSubmit.addEventListener(
        "click",
        async () => {

            const content =
                commentInput.value.trim();


            if (!content) {

                alert(
                    "Please write a comment."
                );

                return;
            }


            commentSubmit.disabled =
                true;

            commentSubmit.textContent =
                "Posting...";


            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/comments/${postId}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body: JSON.stringify({
                                content: content
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok ||
                    !data.success) {

                    alert(
                        data.message ||
                        "Failed to post comment."
                    );

                    return;
                }


                // Clear input

                commentInput.value = "";


                // Remove empty message

                const emptyMessage =
                    commentsList.querySelector(
                        ".comments-empty"
                    );


                if (emptyMessage) {
                    emptyMessage.remove();
                }


                // Display new comment

                displayComment(
                    data.comment
                );


                // Update count

                const currentCount =
                    commentsList.querySelectorAll(
                        ".comment"
                    ).length;


                updateCommentCount(
                    currentCount
                );


                // Scroll to new comment

                commentsList.lastElementChild
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });


            } catch (error) {

                console.error(
                    "Submit comment error:",
                    error
                );

                alert(
                    "Unable to connect to AnimeHub server."
                );


            } finally {

                commentSubmit.disabled =
                    false;

                commentSubmit.textContent =
                    "➤ Comment";

            }

        }
    );

}


// =========================
// UPDATE COMMENT COUNT
// =========================

function updateCommentCount(count) {

    const commentsHeading =
        document.querySelector(
            ".comments-header h2"
        );


    if (!commentsHeading) {
        return;
    }


    commentsHeading.innerHTML =
        `Comments <span>(${count})</span>`;

}


// =========================
// FORMAT COMMENT TIME
// =========================

function formatCommentTime(
    dateString
) {

    const date =
        new Date(
            dateString.replace(
                " ",
                "T"
            ) + "Z"
        );


    if (Number.isNaN(
        date.getTime()
    )) {

        return "Just now";

    }


    const now =
        new Date();


    const difference =
        Math.floor(
            (
                now.getTime() -
                date.getTime()
            ) / 1000
        );


    if (difference < 60) {
        return "Just now";
    }


    if (difference < 3600) {

        return (
            Math.floor(
                difference / 60
            ) + "m"
        );

    }


    if (difference < 86400) {

        return (
            Math.floor(
                difference / 3600
            ) + "h"
        );

    }


    return (
        Math.floor(
            difference / 86400
        ) + "d"
    );

}


// =========================
// ESCAPE HTML
// =========================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


// =========================
// INITIAL LOAD
// =========================
loadPost();
loadLikeStatus();
loadComments();

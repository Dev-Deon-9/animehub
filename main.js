const user = JSON.parse(localStorage.getItem("animehub_user"));
const token = localStorage.getItem("animehub_token");

if (!user || !token) {

    window.location.href = "login.html";

} else {

    console.log("Logged in user:", user);


    // =========================
    // USER INFORMATION
    // =========================

    const username = user.username;


    const navProfileName =
        document.querySelector(".nav-profile span:nth-of-type(1)");

    const sidebarName =
        document.querySelector(".sidebar-profile h3");

    const sidebarUsername =
        document.querySelector(".sidebar-profile p");

    const createPostInput =
        document.querySelector(".create-post input");


    if (navProfileName) {
        navProfileName.textContent = username;
    }


    if (sidebarName) {
        sidebarName.textContent = username;
    }


    if (sidebarUsername) {
        sidebarUsername.textContent = "@" + username;
    }


    if (createPostInput) {
        createPostInput.placeholder =
            `What's on your mind, ${username}?`;
    }


    // =========================
    // UPDATE AVATARS
    // =========================

    const avatars = document.querySelectorAll(
        ".small-avatar, .profile-avatar, .create-post .post-avatar"
    );


    avatars.forEach((avatar) => {

        avatar.textContent =
            username.charAt(0).toUpperCase();

    });

    // =========================
// POST MEDIA PICKER
// =========================

const mediaButton =
    document.getElementById("media-button");

const mediaInput =
    document.getElementById("media-input");

let selectedMedia = null;

if (mediaButton && mediaInput) {

    mediaButton.addEventListener(
        "click",
        () => {
            mediaInput.click();
        }
    );
    mediaInput.addEventListener(
    "change",
    () => {

        const file =
            mediaInput.files[0];

        if (!file) {
            return;
        }

        selectedMedia = file;

        const preview =
            document.getElementById(
                "media-preview"
            );

        if (!preview) {
            return;
        }

        preview.innerHTML = "";

        const fileUrl =
            URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {

            const image =
                document.createElement("img");

            image.src = fileUrl;
            image.alt = "Selected image";

            preview.appendChild(image);

        } else if (
            file.type.startsWith("video/")
        ) {

            const video =
                document.createElement("video");

            video.src = fileUrl;
            video.controls = true;

            preview.appendChild(video);
        }

    }
);
   
}


    // =========================
    // GET POSTS
    // =========================

    async function loadPosts() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/posts",
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                console.error(
                    "Failed to load posts:",
                    data.message
                );

                return;
            }


            const postsContainer =
                document.getElementById("posts-container");


            if (!postsContainer) {

                console.error(
                    "Posts container not found."
                );

                return;
            }


            postsContainer.innerHTML = "";


            // =========================
            // DISPLAY POSTS
            // =========================

            data.posts.forEach((post) => {

                const avatarLetter =
                    post.username
                        .charAt(0)
                        .toUpperCase();


                const postElement =
                    document.createElement("div");


                postElement.className =
                    "post-card";


                // Check if this post belongs
                // to the currently logged-in user

                const isOwner =
                    Number(post.user_id) === Number(user.id);


                postElement.innerHTML = `

                    <div class="post-header">

                        <div class="post-avatar">
                            ${avatarLetter}
                        </div>


                        <div class="post-user">

                            <h3>
                                ${post.username}
                            </h3>

                            <p>
                                @${post.username}
                                ·
                                ${post.created_at}
                            </p>

                        </div>


                        ${
                            isOwner
                                ? `

                                    <div class="post-menu-container">

                                        <button
                                            class="post-menu-button"
                                            data-post-id="${post.id}"
                                            aria-label="Post options"
                                        >
                                            ⋮
                                        </button>


                                        <div
                                            class="post-menu"
                                            id="post-menu-${post.id}"
                                        >

                                            <button
                                                class="edit-post-button"
                                                data-post-id="${post.id}"
                                            >
                                                ✏️ Edit
                                            </button>


                                            <button
                                                class="delete-post-button"
                                                data-post-id="${post.id}"
                                            >
                                                🗑️ Delete
                                            </button>

                                        </div>

                                    </div>

                                `
                                : ""
                        }

                    </div>

                <div class="post-content">

    <p>
        ${post.content}
    </p>

    ${
        post.image
            ? `
                <div class="post-media">

                    ${
                        /\.(mp4|webm|ogg|mov)$/i.test(
                            post.image
                        )
                            ? `
                                <video
                                    src="http://localhost:5000${post.image}"
                                    controls
                                ></video>
                            `
                            : `
                                <img
                                    src="http://localhost:5000${post.image}"
                                    alt="Post media"
                                >
                            `
                    }

                </div>
            `
            : ""
    }

</div>


                <div class="post-actions">

                   <button
                        class="like-post-button"
                        data-post-id="${post.id}"
                        >
                        ♡ Like
                        </button>

                        <button
    class="comment-post-button"
    data-post-id="${post.id}"
>
    💬 Comment
</button>

                        <button>
                        ↗ Share
                        </button>

                </div>


                `;


                postsContainer.appendChild(postElement);


// =========================
// LOAD LIKE STATUS
// =========================
// =========================
// LOAD LIKE STATUS
// =========================

const likeButton =
    postElement.querySelector(".like-post-button");

if (likeButton) {

    if (post.liked) {

        likeButton.textContent =
            `♥ Liked ${post.like_count}`;

        likeButton.classList.add("liked");

    } else {

        likeButton.textContent =
            `♡ Like ${post.like_count}`;

        likeButton.classList.remove("liked");

    }

}
    });

            
          
// =========================
// OPEN COMMENT PAGE
// =========================

const commentButtons =
    document.querySelectorAll(
        ".comment-post-button"
    );

commentButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const postId =
            button.dataset.postId;

        window.location.href =
            `./comment.html?postId=${postId}`;

    });

});

// =========================
// SUBMIT COMMENT
// =========================

const submitCommentButtons =
    document.querySelectorAll(
        ".submit-comment-button"
    );

submitCommentButtons.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            const postId =
                button.dataset.postId;


            const commentsSection =
                document.getElementById(
                    `comments-${postId}`
                );


            const input =
                commentsSection.querySelector(
                    ".comment-input"
                );


            const content =
                input.value.trim();


            if (!content) {

                alert(
                    "Please write a comment first."
                );

                return;
            }


            button.disabled = true;

            button.textContent =
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


                if (!response.ok || !data.success) {

                    alert(
                        data.message ||
                        "Failed to post comment."
                    );

                    return;
                }


                // Clear input

                input.value = "";


                // Add new comment immediately

                const commentsList =
                    commentsSection.querySelector(
                        ".comments-list"
                    );


                // Remove "No comments yet"

                const emptyMessage =
                    commentsList.querySelector(
                        ".comments-empty"
                    );


                if (emptyMessage) {
                    emptyMessage.remove();
                }


                const comment =
                    data.comment;


                const commentElement =
                    document.createElement("div");


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

                        <strong>
                            ${comment.username}
                        </strong>

                        <p>
                            ${comment.content}
                        </p>

                    </div>

                `;


                commentsList.appendChild(
                    commentElement
                );


            } catch (error) {

                console.error(
                    "Submit comment error:",
                    error
                );

                alert(
                    "Unable to connect to AnimeHub server."
                );


            } finally {

                button.disabled = false;

                button.textContent =
                    "Comment";

            }

        }
    );

});

 

            // =========================
            // POST MENU BUTTONS
            // =========================

            const menuButtons =
                document.querySelectorAll(
                    ".post-menu-button"
                );


            menuButtons.forEach((button) => {

                button.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const menu =
                            document.getElementById(
                                `post-menu-${postId}`
                            );


                        // Close every other menu

                        document
                            .querySelectorAll(".post-menu")
                            .forEach((otherMenu) => {

                                if (
                                    otherMenu !== menu
                                ) {

                                    otherMenu.classList.remove(
                                        "show"
                                    );

                                }

                            });


                        // Toggle this menu

                        menu.classList.toggle(
                            "show"
                        );

                    }
                );

            });


            // =========================
            // CLOSE MENUS
            // =========================

            document.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".post-menu")
                        .forEach((menu) => {

                            menu.classList.remove(
                                "show"
                            );

                        });

                }
            );


            // =========================
            // DELETE POST
            // =========================

            const deleteButtons =
                document.querySelectorAll(
                    ".delete-post-button"
                );


            deleteButtons.forEach((button) => {

                button.addEventListener(
                    "click",
                    async (event) => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const confirmDelete =
                            confirm(
                                "Are you sure you want to delete this post?"
                            );


                        if (!confirmDelete) {
                            return;
                        }


                        try {

                            button.disabled = true;

                            button.textContent =
                                "Deleting...";


                            const response =
                                await fetch(
                                    `http://localhost:5000/api/posts/${postId}`,
                                    {
                                        method: "DELETE",

                                        headers: {
                                            "Authorization":
                                                "Bearer " + token
                                        }
                                    }
                                );


                            const data =
                                await response.json();


                            if (!response.ok) {

                                alert(
                                    data.message ||
                                    "Failed to delete post."
                                );

                                return;
                            }


                            console.log(
                                "Post deleted:",
                                data
                            );


                            // Reload feed

                            loadPosts();

                        } catch (error) {

                            console.error(
                                "Delete post error:",
                                error
                            );


                            alert(
                                "Unable to connect to AnimeHub server."
                            );

                        }

                    }
                );

            });
            // =========================
// LIKE POSTS
// =========================

const likeButtons =
    document.querySelectorAll(
        ".like-post-button"
    );


likeButtons.forEach((button) => {

    button.addEventListener(
        "click",
        async () => {

            const postId =
                button.dataset.postId;


            try {

                button.disabled = true;


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


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to like post."
                    );

                    return;
                }


                // Update button

                if (data.liked) {

                    button.textContent =
                        `♥ Liked ${data.likeCount}`;

                    button.classList.add(
                        "liked"
                    );

                } else {

                    button.textContent =
                        `♡ Like ${data.likeCount}`;

                    button.classList.remove(
                        "liked"
                    );

                }


                console.log(
                    "Like updated:",
                    data
                );


            } catch (error) {

                console.error(
                    "Like error:",
                    error
                );


                alert(
                    "Unable to connect to AnimeHub server."
                );


            } finally {

                button.disabled = false;

            }

        }
    );

});



            // =========================
            // EDIT POST
            // =========================

            const editButtons =
                document.querySelectorAll(
                    ".edit-post-button"
                );


            editButtons.forEach((button) => {

                button.addEventListener(
                    "click",
                    async (event) => {

                        event.stopPropagation();


                        const postId =
                            button.dataset.postId;


                        const postElement =
                            button.closest(
                                ".post-card"
                            );


                        const contentElement =
                            postElement.querySelector(
                                ".post-content p"
                            );


                        const oldContent =
                            contentElement.textContent.trim();


                        const newContent =
                            prompt(
                                "Edit your post:",
                                oldContent
                            );


                        // User clicked Cancel

                        if (newContent === null) {
                            return;
                        }


                        const trimmedContent =
                            newContent.trim();


                        if (!trimmedContent) {

                            alert(
                                "Post content cannot be empty."
                            );

                            return;
                        }


                        // Nothing changed

                        if (
                            trimmedContent ===
                            oldContent
                        ) {
                            return;
                        }


                        try {

                            button.disabled = true;

                            button.textContent =
                                "Saving...";


                            const response =
                                await fetch(
                                    `http://localhost:5000/api/posts/${postId}`,
                                    {
                                        method: "PUT",

                                        headers: {
                                            "Content-Type":
                                                "application/json",

                                            "Authorization":
                                                "Bearer " + token
                                        },

                                        body: JSON.stringify({
                                            content:
                                                trimmedContent
                                        })
                                    }
                                );


                            const data =
                                await response.json();


                            if (!response.ok) {

                                alert(
                                    data.message ||
                                    "Failed to update post."
                                );

                                return;
                            }


                            console.log(
                                "Post updated:",
                                data.post
                            );


                            // Reload feed

                            loadPosts();

                        } catch (error) {

                            console.error(
                                "Edit post error:",
                                error
                            );


                            alert(
                                "Unable to connect to AnimeHub server."
                            );

                        }

                    }
                );

            });

        } catch (error) {

            console.error(
                "Error loading posts:",
                error
            );

        }

    }


    // =========================
    // LOAD POSTS
    // =========================

    loadPosts();


    // =========================
// CREATE POST
// =========================

const postInput =
    document.getElementById("post-input");


const postSubmit =
    document.getElementById("post-submit");


if (postInput && postSubmit) {

    postSubmit.addEventListener(
        "click",
        async () => {

            const content =
                postInput.value.trim();


            if (!content) {

                alert(
                    "Please write something first."
                );

                return;
            }


            try {

                postSubmit.disabled = true;

                postSubmit.textContent =
                    "Posting...";


                // =========================
                // CREATE FORM DATA
                // =========================

                const formData =
                    new FormData();


                // Add caption

                formData.append(
                    "content",
                    content
                );


                // Add image/video if selected

                if (selectedMedia) {

                    formData.append(
                        "media",
                        selectedMedia
                    );

                }


                // =========================
                // SEND POST
                // =========================

                const response =
                    await fetch(
                        "http://localhost:5000/api/posts",
                        {
                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " + token

                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Failed to create post."
                    );

                    return;
                }


                console.log(
                    "Post created:",
                    data.post
                );


                // =========================
                // CLEAR POST INPUT
                // =========================

                postInput.value = "";


                // Clear selected media

                selectedMedia = null;


                if (mediaInput) {

                    mediaInput.value = "";

                }


                // Clear media preview

                const preview =
                    document.getElementById(
                        "media-preview"
                    );


                if (preview) {

                    preview.innerHTML = "";

                }


                // Refresh feed

                loadPosts();


            } catch (error) {

                console.error(
                    "Create post error:",
                    error
                );


                alert(
                    "Unable to connect to AnimeHub server."
                );


            } finally {

                postSubmit.disabled = false;

                postSubmit.textContent =
                    "Post";

            }

        }
    );

}
}

// =========================================
// REAL NOTIFICATION COUNT
// =========================================

function loadNotificationCount() {

    const token =
        localStorage.getItem("animehub_token");

    const notificationCount =
        document.getElementById(
            "notification-count"
        );

    if (!token || !notificationCount) {
        return;
    }

    fetch(
        "http://localhost:5000/api/notifications/unread-count",
        {
            headers: {
                "Authorization":
                    "Bearer " + token
            }
        }
    )
    .then(response => response.json())
    .then(data => {

        if (!data.success) {
            return;
        }

        notificationCount.textContent =
            data.count;

    })
    .catch(error => {

        console.error(
            "Notification count error:",
            error
        );

    });

}


document.addEventListener(
    "DOMContentLoaded",
    loadNotificationCount
);


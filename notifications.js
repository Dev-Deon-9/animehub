// =========================================
// ANIMEHUB NOTIFICATIONS
// =========================================

const token =
    localStorage.getItem("animehub_token");

const savedUser =
    localStorage.getItem("animehub_user");


if (!token || !savedUser) {
    window.location.href = "./login.html";
}


let allNotifications = [];

let currentFilter = "all";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadNotifications();

        setupTabs();

        setupMarkAll();

    }
);


// =========================================
// LOAD NOTIFICATIONS
// =========================================

async function loadNotifications() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/notifications",
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
                "Failed to load notifications:",
                data.message
            );

            return;
        }


        allNotifications =
            data.notifications || [];


        renderNotifications();


    } catch (error) {

        console.error(
            "Load notifications error:",
            error
        );

    }

}


// =========================================
// RENDER NOTIFICATIONS
// =========================================

function renderNotifications() {

    const sections =
        document.querySelectorAll(
            ".notification-section"
        );


    // Remove the old hard-coded notifications
    sections.forEach(
        (section) => {

            section.remove();

        }
    );


    if (allNotifications.length === 0) {

        updateEmptyState(true);

        return;

    }


    updateEmptyState(false);


    const section =
        document.createElement("div");

    section.className =
        "notification-section";


    const heading =
        document.createElement("h3");

    heading.textContent =
        "Recent Activity";


    section.appendChild(heading);


    allNotifications
        .filter(notificationMatchesFilter)
        .forEach(
            (notification) => {

                section.appendChild(
                    createNotification(
                        notification
                    )
                );

            }
        );


    const container =
        document.querySelector(
            ".notifications-container"
        );


    const emptyState =
        document.getElementById(
            "no-notifications"
        );


    container.insertBefore(
        section,
        emptyState
    );


    updateEmptyState(
        section.querySelectorAll(
            ".notification"
        ).length === 0
    );

}


// =========================================
// CREATE NOTIFICATION
// =========================================

function createNotification(
    notification
) {

    const button =
        document.createElement("button");


    button.className =
        "notification";


    if (!notification.is_read) {

        button.classList.add("unread");

    }


    button.dataset.type =
        notification.type;


    button.dataset.notificationId =
        notification.id;


    button.dataset.postId =
        notification.post_id || "";


    button.dataset.senderId =
        notification.sender_id || "";


    // -----------------------------------------
    // ICON
    // -----------------------------------------

    const icon =
        document.createElement("div");

    icon.className =
        `notification-icon ${notification.type}`;


    if (notification.type === "like") {

        icon.textContent = "❤️";

    }

    else if (
        notification.type === "comment"
    ) {

        icon.textContent = "💬";

    }

    else if (
        notification.type === "follow"
    ) {

        icon.textContent = "👤";

    }

    else if (
        notification.type === "view"
    ) {

        icon.textContent = "👁";

    }

    else {

        icon.textContent = "🔔";

    }


    // -----------------------------------------
    // AVATAR
    // -----------------------------------------

    const avatar =
        document.createElement("div");

    avatar.className =
        "notification-avatar purple";


    if (
        notification.sender_profile_picture
    ) {

        avatar.innerHTML = `
            <img
                src="http://localhost:5000${notification.sender_profile_picture}"
                alt="${escapeHTML(
                    notification.sender_username
                )}"
            >
        `;

    } else {

        avatar.textContent =
            notification
                .sender_username
                .charAt(0)
                .toUpperCase();

    }


    // -----------------------------------------
    // CONTENT
    // -----------------------------------------

    const content =
        document.createElement("div");

    content.className =
        "notification-content";


    const username =
        escapeHTML(
            notification.sender_username
        );


    const paragraph =
        document.createElement("p");


    if (notification.type === "like") {

        paragraph.innerHTML =
            `<strong>${username}</strong> liked your post.`;

    }

    else if (
        notification.type === "comment"
    ) {

        paragraph.innerHTML =
            `<strong>${username}</strong> commented on your post.`;

    }

    else if (
        notification.type === "follow"
    ) {

        paragraph.innerHTML =
            `<strong>${username}</strong> started following you.`;

    }

    else if (
        notification.type === "view"
    ) {

        paragraph.innerHTML =
            `<strong>${username}</strong> viewed your profile.`;

    }

    else {

        paragraph.innerHTML =
            `<strong>${username}</strong> interacted with your post.`;

    }


    content.appendChild(paragraph);


    // Comment text
    if (
        notification.type === "comment" &&
        notification.comment_content
    ) {

        const commentText =
            document.createElement("span");

        commentText.textContent =
            `"${notification.comment_content}"`;

        content.appendChild(
            commentText
        );

    }


    const time =
        document.createElement("small");

    time.textContent =
        formatNotificationTime(
            notification.created_at
        );


    content.appendChild(time);


    // -----------------------------------------
    // UNREAD DOT
    // -----------------------------------------

    if (!notification.is_read) {

        const dot =
            document.createElement("span");

        dot.className =
            "notification-dot";

        button.appendChild(dot);

    }


    button.appendChild(icon);
    button.appendChild(avatar);
    button.appendChild(content);


    // -----------------------------------------
    // CLICK
    // -----------------------------------------

    button.addEventListener(
        "click",
        () => {

            markNotificationRead(
                notification.id
            );


            if (
                notification.post_id
            ) {

                window.location.href =
                    `comment.html?postId=${notification.post_id}`;

            }

        }
    );


    return button;

}


// =========================================
// MARK ONE AS READ
// =========================================

async function markNotificationRead(
    notificationId
) {

    try {

        await fetch(
            `http://localhost:5000/api/notifications/${notificationId}/read`,
            {
                method: "POST",

                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        const notification =
            allNotifications.find(
                item =>
                    item.id ===
                    notificationId
            );


        if (notification) {

            notification.is_read = 1;

        }


        renderNotifications();


    } catch (error) {

        console.error(
            "Mark notification error:",
            error
        );

    }

}


// =========================================
// MARK ALL AS READ
// =========================================

function setupMarkAll() {

    const button =
        document.getElementById(
            "mark-all-read"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const unread =
                allNotifications.filter(
                    notification =>
                        !notification.is_read
                );


            for (
                const notification
                of unread
            ) {

                await markNotificationRead(
                    notification.id
                );

            }

        }
    );

}


// =========================================
// FILTER TABS
// =========================================

function setupTabs() {

    const tabs =
        document.querySelectorAll(
            ".notification-tabs button"
        );


    tabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    tabs.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    tab.classList.add(
                        "active"
                    );


                    currentFilter =
                        tab.dataset.filter;


                    renderNotifications();

                }
            );

        }
    );

}


// =========================================
// FILTER LOGIC
// =========================================

function notificationMatchesFilter(
    notification
) {

    if (currentFilter === "all") {

        return true;

    }


    if (currentFilter === "unread") {

        return !notification.is_read;

    }


    if (currentFilter === "mentions") {

        return notification.type ===
            "mention";

    }


    return true;

}


// =========================================
// EMPTY STATE
// =========================================

function updateEmptyState(
    shouldShow
) {

    const emptyState =
        document.getElementById(
            "no-notifications"
        );


    if (!emptyState) {
        return;
    }


    emptyState.style.display =
        shouldShow
            ? "block"
            : "none";

}


// =========================================
// TIME FORMAT
// =========================================

function formatNotificationTime(
    dateString
) {

    const date =
        new Date(
            dateString.replace(
                " ",
                "T"
            ) + "Z"
        );


    const now =
        new Date();


    const seconds =
        Math.floor(
            (now - date) / 1000
        );


    if (seconds < 60) {

        return "Just now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes} minute${
            minutes === 1 ? "" : "s"
        } ago`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} hour${
            hours === 1 ? "" : "s"
        } ago`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days === 1) {

        return "Yesterday";

    }


    return `${days} days ago`;

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(
    value
) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}
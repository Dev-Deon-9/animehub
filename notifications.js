// =========================================
// ANIMEHUB NOTIFICATIONS
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const notifications =
        document.querySelectorAll(".notification");

    const tabs =
        document.querySelectorAll(
            ".notification-tabs button"
        );

    const markAllButton =
        document.getElementById("mark-all-read");

    const emptyState =
        document.getElementById(
            "no-notifications"
        );


    // =========================================
    // CLICK NOTIFICATION
    // =========================================

    notifications.forEach((notification) => {

        notification.addEventListener("click", () => {

            const type =
                notification.dataset.type;

            const target =
                notification.dataset.target;


            // Mark as read
            notification.classList.remove(
                "unread"
            );

            const dot =
                notification.querySelector(
                    ".notification-dot"
                );

            if (dot) {
                dot.remove();
            }


            // Where the notification would lead
            if (type === "follow") {

                // Later:
                // window.location.href =
                // "profile.html";

                console.log(
                    "Opening user's profile..."
                );

            } else if (
                type === "comment" ||
                type === "like" ||
                type === "share"
            ) {

                // Later:
                // window.location.href =
                // "comment.html";

                console.log(
                    "Opening related post..."
                );

            } else if (type === "view") {

                console.log(
                    "Opening profile..."
                );

            }

        });

    });


    // =========================================
    // TABS
    // =========================================

    tabs.forEach((tab) => {

        tab.addEventListener("click", () => {

            tabs.forEach((item) => {
                item.classList.remove("active");
            });

            tab.classList.add("active");


            const filter =
                tab.dataset.filter;


            notifications.forEach(
                (notification) => {

                    if (filter === "all") {

                        notification.style.display =
                            "flex";

                    }

                    else if (
                        filter === "unread"
                    ) {

                        if (
                            notification.classList
                                .contains("unread")
                        ) {

                            notification.style.display =
                                "flex";

                        } else {

                            notification.style.display =
                                "none";

                        }

                    }

                    else if (
                        filter === "mentions"
                    ) {

                        // We don't have mention
                        // notifications yet.
                        notification.style.display =
                            "none";

                    }

                }
            );

            updateEmptyState();

        });

    });


    // =========================================
    // MARK ALL AS READ
    // =========================================

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            () => {

                notifications.forEach(
                    (notification) => {

                        notification.classList
                            .remove("unread");

                        const dot =
                            notification.querySelector(
                                ".notification-dot"
                            );

                        if (dot) {
                            dot.remove();
                        }

                    }
                );

                updateEmptyState();

            }
        );

    }


    // =========================================
    // EMPTY STATE
    // =========================================

    function updateEmptyState() {

        const visible =
            Array.from(notifications)
                .some(
                    (notification) =>
                        notification.style.display !==
                        "none"
                );

        if (emptyState) {

            emptyState.style.display =
                visible ? "none" : "block";

        }

    }

});
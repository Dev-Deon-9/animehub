// =========================================
// ANIMEHUB MESSAGES
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const messagesPage =
        document.querySelector(".messages-page");

    const conversations =
        document.querySelectorAll(".conversation");

    const backButton =
        document.getElementById("back-btn");

    const chatName =
        document.getElementById("chat-name");

    const chatUsername =
        document.getElementById("chat-username");

    const chatAvatar =
        document.getElementById("chat-avatar");

    const messageForm =
        document.getElementById("message-form");

    const messageInput =
        document.getElementById("message-input");

    const chatBody =
        document.getElementById("chat-body");

    const searchInput =
        document.getElementById("message-search");


    // =========================================
    // OPEN CONVERSATION
    // =========================================

    conversations.forEach((conversation) => {

        conversation.addEventListener("click", () => {

            const user =
                conversation.dataset.user;

            const username =
                conversation.dataset.username;

            const avatar =
                conversation.dataset.avatar;

            const color =
                conversation.dataset.color;


            // Update chat header
            chatName.textContent = user;
            chatUsername.textContent = username;

            chatAvatar.textContent = avatar;

            // Reset avatar colors
            chatAvatar.className =
                "message-avatar " + color;


            // Mark selected conversation
            conversations.forEach((item) => {
                item.classList.remove("active");
            });

            conversation.classList.add("active");


            // Remove unread number
            const unread =
                conversation.querySelector(".unread");

            if (unread) {
                unread.remove();
            }


            // Open chat
            messagesPage.classList.add("chat-open");


            // Mobile scroll to bottom
            chatBody.scrollTop =
                chatBody.scrollHeight;

        });

    });


    // =========================================
    // BACK BUTTON
    // =========================================

    if (backButton) {

        backButton.addEventListener("click", () => {

            messagesPage.classList.remove(
                "chat-open"
            );

        });

    }


    // =========================================
    // SEND MESSAGE
    // =========================================

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                const text =
                    messageInput.value.trim();

                if (!text) return;


                // Create message
                const message =
                    document.createElement("div");

                message.className =
                    "chat-message sent";


                const bubble =
                    document.createElement("div");

                bubble.className =
                    "message-bubble";

                bubble.textContent = text;


                const time =
                    document.createElement("span");

                time.textContent =
                    getCurrentTime();


                message.appendChild(bubble);
                message.appendChild(time);

                chatBody.appendChild(message);


                // Clear input
                messageInput.value = "";


                // Scroll down
                chatBody.scrollTop =
                    chatBody.scrollHeight;

            }
        );

    }


    // =========================================
    // SEARCH CONVERSATIONS
    // =========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const search =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                conversations.forEach(
                    (conversation) => {

                        const name =
                            conversation
                                .dataset.user
                                .toLowerCase();

                        const username =
                            conversation
                                .dataset.username
                                .toLowerCase();


                        if (
                            name.includes(search) ||
                            username.includes(search)
                        ) {

                            conversation.style.display =
                                "flex";

                        } else {

                            conversation.style.display =
                                "none";

                        }

                    }
                );

            }
        );

    }


    // =========================================
    // CURRENT TIME
    // =========================================

    function getCurrentTime() {

        const now = new Date();

        return now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }

});
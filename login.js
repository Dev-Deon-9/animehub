const loginForm = document.querySelector(".login-form");


// Password show/hide
const passwordToggle = document.querySelector(".password-toggle");
const passwordInput = document.getElementById("password");

passwordToggle.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordToggle.textContent = "🙈";
        passwordToggle.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        passwordToggle.textContent = "👁";
        passwordToggle.setAttribute("aria-label", "Show password");
    }
});


// REAL LOGIN
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Login failed.");
            return;
        }

        // Save authentication information
        localStorage.setItem("animehub_token", data.token);

        localStorage.setItem(
            "animehub_user",
            JSON.stringify(data.user)
        );

        // Login successful
        window.location.href = "./index.html";

    } catch (error) {
        console.error("Login error:", error);

        alert("Unable to connect to AnimeHub server.");
    }
});
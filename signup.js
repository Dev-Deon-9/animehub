const signupForm = document.querySelector(".signup-form");

// Password show/hide
document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);

        if (input.type === "password") {
            input.type = "text";
            button.textContent = "🙈";
            button.setAttribute("aria-label", "Hide password");
        } else {
            input.type = "password";
            button.textContent = "👁";
            button.setAttribute("aria-label", "Show password");
        }
    });
});


// Password strength
const passwordInput = document.getElementById("password");
const strengthBars = document.querySelectorAll(".password-strength span");

passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;

    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;

    strengthBars.forEach((bar, index) => {
        bar.classList.toggle("active", index < strength);
    });
});


// REAL SIGNUP
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Signup failed.");
            return;
        }

        localStorage.setItem("animehub_token", data.token);
        localStorage.setItem(
            "animehub_user",
            JSON.stringify(data.user)
        );

        // Redirect immediately
        window.location.href = "./index.html";

    } catch (error) {
        console.error("Signup error:", error);
        alert("Unable to connect to AnimeHub server.");
    }
});
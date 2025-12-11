const API = "http://localhost:4000/api";

const form = document.getElementById("loginForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Login failed";
      msg.className = "error";
      return;
    }

    // Save token for protected routes
    localStorage.setItem("token", data.token);

    msg.textContent = "Login successful!";
    msg.className = "success";

    setTimeout(() => {
      window.location.href = "upload.html";
    }, 500);

  } catch (err) {
    msg.textContent = "Server error. Is backend running?";
    msg.className = "error";
  }
});

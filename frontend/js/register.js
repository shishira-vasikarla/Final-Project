const API = "http://localhost:4000/api";

const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("usernameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Registration failed";
      msg.className = "error";
      return;
    }

    msg.textContent = data.message;
    msg.className = "success";

    // go to login after short delay
    setTimeout(() => {
      window.location.href = "login.html";
    }, 700);

  } catch (err) {
    msg.textContent = "Server error. Is backend running?";
    msg.className = "error";
  }
});

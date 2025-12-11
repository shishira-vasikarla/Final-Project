const API = "http://localhost:4000/api";
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) window.location.href = "login.html";

const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const privacySelect = document.getElementById("privacySelect");
const msg = document.getElementById("msg");
const shareBox = document.getElementById("shareBox");

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  shareBox.textContent = "";

  const file = fileInput.files[0];
  const privacy = privacySelect.value;

  // Frontend validation (backend also validates)
  if (!file) {
    msg.textContent = "Please choose a file.";
    msg.className = "error";
    return;
  }

  const allowedTypes = ["application/pdf", "video/mp4"];
  if (!allowedTypes.includes(file.type)) {
    msg.textContent = "Only PDF or MP4 files are allowed.";
    msg.className = "error";
    return;
  }

  const maxSize = 20 * 1024 * 1024; // 20MB
  if (file.size > maxSize) {
    msg.textContent = "File too large. Max size is 20MB.";
    msg.className = "error";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("privacy", privacy);

  try {
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data.error || "Upload failed.";
      msg.className = "error";
      return;
    }

    msg.textContent = "File uploaded successfully!";
    msg.className = "success";

    if (data.shareLink) {
        shareBox.innerHTML = `
        Private Share Link:<br/>
        <b>http://localhost:4000${data.shareLink}</b>
      `;
      
    }

    uploadForm.reset();

  } catch (err) {
    msg.textContent = "Server error. Is backend running?";
    msg.className = "error";
  }
});

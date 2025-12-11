


const API = "http://localhost:4000/api";
const token = localStorage.getItem("token");

// if not logged in, go to login
if (!token) window.location.href = "login.html";

const fileList = document.getElementById("fileList");
const msg = document.getElementById("msg");

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

async function loadMyFiles() {
  msg.textContent = "";
  fileList.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API}/my-files`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const files = await res.json();
    if (!res.ok) {
      fileList.innerHTML = "";
      msg.textContent = files.error || "Failed to load files";
      msg.className = "error";
      return;
    }

    if (files.length === 0) {
      fileList.innerHTML = "<p>No files uploaded yet.</p>";
      return;
    }

    fileList.innerHTML = files.map(f => `
      <div class="file-card">
        <b>${f.filename}</b>
        <div class="meta">
          ${(f.size/1024/1024).toFixed(2)} MB • ${f.privacy} • ${new Date(f.uploaded_at).toLocaleString()}
        </div>

        <div class="actions">
          <button onclick="downloadFile(${f.id})">Download</button>
          <button class="danger" onclick="deleteFile(${f.id})">Delete</button>
        </div>

        ${f.share_token ? `
          <div class="share">
            Private Link:
            <a target="_blank" href="http://localhost:4000/api/files/private/${f.share_token}">
              http://localhost:4000/api/files/private/${f.share_token}
            </a>
          </div>
        ` : ""}
      </div>
    `).join("");

  } catch (err) {
    fileList.innerHTML = "";
    msg.textContent = "Server error loading files.";
    msg.className = "error";
  }
}

// ✅ UPDATED download: uses fetch so token is included
async function downloadFile(id) {
  try {
    const res = await fetch(`${API}/files/${id}/download`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Download failed");
      return;
    }

    const blob = await res.blob();

    // Try to read filename from response headers, fallback if missing
    const disposition = res.headers.get("Content-Disposition");
    let filename = "downloaded_file";
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }

    // Trigger browser download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    alert("Server error while downloading.");
  }
}

async function deleteFile(id) {
  if (!confirm("Delete this file?")) return;

  const res = await fetch(`${API}/files/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  alert(data.message || data.error);

  loadMyFiles();
}

loadMyFiles(); 
// const API = "http://localhost:4000/api";
// const publicList = document.getElementById("publicList");
// const msg = document.getElementById("msg");

// // Logout button only works if logged in; otherwise harmless
// document.getElementById("logoutBtn").addEventListener("click", () => {
//   localStorage.removeItem("token");
//   window.location.href = "login.html";
// });

// async function loadPublicFiles() {
//   msg.textContent = "";
//   publicList.innerHTML = "Loading...";

//   try {
//     const res = await fetch(`${API}/public-files`);
//     const files = await res.json();

//     if (!res.ok) {
//       publicList.innerHTML = "";
//       msg.textContent = files.error || "Failed to load public files.";
//       msg.className = "error";
//       return;
//     }

//     if (files.length === 0) {
//       publicList.innerHTML = "<p>No public files available yet.</p>";
//       return;
//     }

//     publicList.innerHTML = files.map(f => `
//       <div class="file-card">
//         <b>${f.filename}</b>
//         <div class="meta">
//           ${(f.size/1024/1024).toFixed(2)} MB • ${new Date(f.uploaded_at).toLocaleString()}
//         </div>
//         <div class="actions">
//           <button onclick="downloadPublic(${f.id})">Download</button>
//         </div>
//       </div>
//     `).join("");

//   } catch (err) {
//     publicList.innerHTML = "";
//     msg.textContent = "Server error.";
//     msg.className = "error";
//   }
// }

// function downloadPublic(id) {
//   // no auth needed for public downloads
//   window.location.href = `${API}/public/${id}/download`;
// }

// loadPublicFiles();


const API = "http://localhost:4000/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

const publicList = document.getElementById("publicList");
const msg = document.getElementById("msg");

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

async function loadMyDownloads() {
  msg.textContent = "";
  publicList.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API}/my-downloads`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const files = await res.json();

    if (!res.ok) {
      publicList.innerHTML = "";
      msg.textContent = files.error || "Failed to load downloads.";
      msg.className = "error";
      return;
    }

    if (files.length === 0) {
      publicList.innerHTML = "<p>You haven’t downloaded anything yet.</p>";
      return;
    }

    publicList.innerHTML = files.map(f => `
      <div class="file-card">
        <b>${f.filename}</b>
        <div class="meta">
          Downloaded: ${new Date(f.downloaded_at).toLocaleString()} <br>
          Size: ${(f.size/1024/1024).toFixed(2)} MB • Uploaded by: ${f.uploader}
        </div>

        <div class="actions">
          <button onclick="downloadAgain(${f.file_id})">Download Again</button>
        </div>
      </div>
    `).join("");

  } catch (err) {
    publicList.innerHTML = "";
    msg.textContent = "Server error.";
    msg.className = "error";
  }
}

function downloadAgain(fileId) {
  // this will re-log as a new download too
  window.location.href = `${API}/files/${fileId}/download`;
}

loadMyDownloads();

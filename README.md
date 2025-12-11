# Secure File Management Application

This is a full-stack web application for **secure file upload and management**.

Users can:

- Register an account  
- Log in  
- Upload files  
- View the list of uploaded files  
- Delete files  
- Log out  

The goal is that you can **run the server and use the app directly in your browser**, following the steps below.

---

## 📁 Folder Structure

The repository is organized as:

```text
.
├── backend/          # Node.js + Express server (APIs, auth, DB, file handling)
├── frontend/         # Frontend UI code
├── uploads/          # Folder where uploaded files are stored
├── database.sqlite   # SQLite database file
└── README.md

### backend/

Contains all server-side logic:

- `server.js` — Main Express server  
- `routes/` — Auth and file routes  
- `middleware/` — Auth middleware  
- `db.js` — SQLite connection  
- `package.json` — Backend dependencies  
- `.env` — Environment variables (**NOT included in GitHub**)  

### frontend/

Contains HTML, CSS, JavaScript or framework-based code.

### uploads/

Used by backend to store uploaded files.

### database.sqlite

SQLite database storing:

- Users  
- File metadata  

---

# ✅ Prerequisites

Install the following:

- **Node.js (16+)**
- **npm**

SQLite requires no installation — it is included automatically.

---

# 🚀 How to Run the Project (Very Simple Instructions)

Follow these steps **exactly**.  
If followed correctly, the project will run on any machine.

---

## 1️⃣ Download the Project

Either clone:

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>

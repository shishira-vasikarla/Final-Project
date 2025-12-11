
Secure File Management Application

This is a full-stack web application for secure user authentication and file management.

Users can:

* Register an account
* Log in
* Upload files
* View uploaded files
* Delete files
* Log out

The backend uses Node.js, Express, SQLite, and JWT authentication.
The frontend communicates with the backend through REST APIs.

---

## FOLDER STRUCTURE

Project structure:

backend/          → Node.js server (authentication, API routes, database logic)
frontend/         → Frontend UI
uploads/          → Folder where uploaded files are stored
database.sqlite   → SQLite database
README            → Documentation

Inside backend/:

* server.js (main server)
* routes/ (API routes)
* middleware/ (authentication middleware)
* db.js (SQLite connection)
* package.json (backend dependencies)
* .env (must be created locally; not included in GitHub)

uploads/ is where user-uploaded files will be saved.

---

## PREREQUISITES

Install:

* Node.js (version 16 or later)
* npm (comes with Node.js)

No database installation is needed. SQLite is file-based.

---

## HOW TO RUN THE PROJECT (IMPORTANT)

These steps MUST work on any laptop. If unclear, marks will be deducted.

1. Download or clone the repository:

git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>
cd <your-repo-name>

You should now see:
backend/
frontend/
uploads/
database.sqlite

---

## BACKEND SETUP

1. Go into backend folder:

cd backend

2. Install dependencies:

npm install

3. Create a file named .env inside the backend folder with this content:

PORT=3000
DB_PATH=../database.sqlite
JWT_SECRET=super-secret-key-change-me

IMPORTANT:

* .env is NOT included in GitHub.
* You MUST create it manually before running the server.

4. Start the backend server:

npm start
(or: node server.js)

You should see:
Server running on [http://localhost:3000](http://localhost:3000)
Connected to SQLite database

---

## FRONTEND SETUP

Choose the correct option depending on your setup:

## OPTION A: Backend serves the frontend (recommended)

If your backend already serves your frontend files:
Just open the browser and go to:
[http://localhost:3000](http://localhost:3000)

## OPTION B: Frontend has its own server (React, Vite, etc.)

1. Open a second terminal window
2. Go to frontend folder:
   cd frontend
3. Install dependencies:
   npm install
4. Start the frontend:
   npm start or npm run dev
5. Open the URL shown in the terminal (for example):
   [http://localhost:5173](http://localhost:5173)

Frontend must send API requests to:
[http://localhost:3000/api](http://localhost:3000/api)

---

## HOW TO USE THE APPLICATION

This is the required demo flow:

1. Register

   * Go to register page
   * Enter email + password
   * Submit

2. Login

   * Enter the same credentials
   * Login successful, token created

3. Upload a file

   * Click "Upload"
   * Choose file
   * File appears in list

4. View files

   * List shows files uploaded by the user

5. Delete a file

   * Click delete icon
   * File disappears

6. Logout

   * Session cleared
   * Redirect to login

Your video demo must show:
Register → Login → Upload → View → Delete → Logout

---

## API ENDPOINT DOCUMENTATION

## AUTHENTICATION ENDPOINTS

POST /api/auth/register
Description: Register a new user
Request body:
{
"email": "[example@email.com](mailto:example@email.com)",
"password": "Password123"
}
Response:
{
"message": "User registered successfully"
}

POST /api/auth/login
Description: Login user and return JWT token
Request body:
{
"email": "[example@email.com](mailto:example@email.com)",
"password": "Password123"
}
Response:
{
"token": "jwt-token-string",
"user": {
"id": 1,
"email": "[example@email.com](mailto:example@email.com)"
}
}

Authorization header required for protected routes:
Authorization: Bearer <token>

---

## FILE ENDPOINTS

POST /api/files/upload
Description: Upload a file
Form field name: file
Response example:
{
"message": "File uploaded successfully",
"file": {
"id": 1,
"originalName": "myfile.pdf",
"storedName": "1731831234-myfile.pdf",
"uploadedAt": "2025-12-10T19:00:00Z"
}
}

GET /api/files
Description: Get all files for logged-in user
Response example:
[
{
"id": 1,
"originalName": "sample.pdf",
"storedName": "1731831234-sample.pdf",
"uploadedAt": "2025-12-10T19:00:00Z"
}
]

GET /api/files/:id
Description: Download/view a file by its ID

DELETE /api/files/:id
Description: Delete a file
Response:
{
"message": "File deleted successfully"
}

---

## ENVIRONMENT VARIABLES (SUMMARY)

You must create backend/.env with:

PORT=3000
DB_PATH=../database.sqlite
JWT_SECRET=super-secret-key-change-me

---

## IMPORTANT NOTES

* node_modules is NOT included in GitHub.
  Run npm install before starting the backend (and frontend if needed).

* .env is NOT included.
  You must create it manually.

* uploads folder must exist. It can be empty.

* database.sqlite must exist in the project root.

---

## CHECKLIST FOR MARKER

The application is correct if the marker can:

1. Install Node.js
2. Download code
3. Run:
   cd backend
   npm install
4. Create .env exactly as shown
5. Start:
   npm start
6. Open [http://localhost:3000](http://localhost:3000)
7. Perform:

   * Register
   * Login
   * Upload
   * View
   * Delete
   * Logout

No extra setup should be required.




# 🚀 Project Overview

The Secure File Sharing System allows users to upload, encrypt, store, and share files safely.  
It ensures confidentiality, integrity, and controlled access using encryption, authentication, OTP verification, and role-based authorization.

This project demonstrates real-world security practices used in modern web applications.

---

# ✨ Key Features

## 🔑 Authentication & Authorization
- JWT-based authentication
- Secure login and registration
- Google OAuth 2.0 login
- Role-based access control (User / Admin)
- Protected routes (frontend and backend)

## 🔐 File Security
- AES-based file encryption before storage
- Encrypted files stored locally or on AWS S3
- Secure decryption only for authorized users
- Unique encrypted file identifiers

## 📤 File Management
- Upload encrypted files
- Download and decrypt files securely
- View uploaded files
- Share files with controlled access

## 📧 OTP & Secure Sharing
- OTP-based secure file sharing
- Email verification for file access
- Time-bound access tokens

## 🛡️ System Protection
- Rate limiting to prevent API abuse
- Helmet security headers
- CORS protection
- Input validation
- Centralized error handling middleware

## 👨‍💼 Admin Panel
- View registered users
- View uploaded files
- Admin-only protected routes
- Scheduled admin reports using cron jobs

## 🧱 Tech Stack

### 🌐 Frontend
- React.js
- React Router
- Axios
- Tailwind CSS

### 🖥️ Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js (Google OAuth 2.0)
- JWT-based authentication

### 🔒 Security & Utilities
- AES encryption
- bcrypt for password hashing
- Multer for secure file handling
- Nodemailer for email services
- Rate limiting for API protection
- Helmet for HTTP security headers
- Cron jobs for scheduled tasks

## 🧱 Tech Stack

<p>
  <img src="https://skillicons.dev/icons?i=react,tailwind,js,nodejs,express,mongodb,aws,docker,git" />
</p>
>

## ✅ Features Summary
- Secure encrypted file upload & download
- JWT & Google OAuth authentication
- OTP-based secure file sharing
- Role-based access control (User/Admin)
- AES file encryption before storage
- Admin monitoring & audit logs

## 🔐 Security Highlights
- AES encryption for file protection
- bcrypt password hashing
- JWT-based stateless authentication
- OTP verification for sensitive actions
- Rate limiting & HTTP security headers
- Encrypted storage (Local / AWS S3)

## 🔄 Authentication Flow
1. User registers or logs in
2. JWT token issued after successful authentication
3. Token stored securely on client
4. Protected routes validate JWT on every request
5. Admin routes require role verification

## 🔐 File Encryption Flow
1. File uploaded by authenticated user
2. File encrypted using AES before storage
3. Encrypted file stored locally or on AWS S3
4. Metadata stored in MongoDB
5. File decrypted only for authorized access

## 📡 API Overview
- POST /api/auth/login
- POST /api/auth/register
- POST /api/files/upload
- GET /api/files/:id
- POST /api/files/share
- POST /api/otp/verify
- GET /api/admin/users

## 🧪 Error Handling
- Centralized error handling middleware
- Proper HTTP status codes
- Validation & authentication errors handled securely
- No sensitive data exposed in responses

## 📸 Screenshots

<p align="center">
  <img src="screenshots/login.png" width="260" />
  <img src="screenshots/register.png" width="260" />
  <img src="screenshots/user-dashboard.png" width="260" />
</p>

<p align="center">
  <img src="screenshots/file-upload.png" width="260" />
  <img src="screenshots/file-download.png" width="260" />
  <img src="screenshots/otp-verify.png" width="260" />
</p>

<p align="center">
  <img src="screenshots/admin-dashboard.png" width="260" />
  <img src="screenshots/users-data.png" width="260" />
  <img src="screenshots/files.png" width="260" />
</p>

## 🏗️ System Architecture — Encrypted File Share

```
# ===========================
# CLIENT LAYER (Frontend)
# ===========================
┌─────────────────────────┐
│        Client (UI)       │
│  React + Tailwind CSS    │
│  Browser / Mobile        │
└─────────────┬───────────┘
              │ HTTPS + JWT
              ▼

# ===========================
# API SERVER LAYER (Backend)
# ===========================
┌─────────────────────────┐
│   API Gateway / Server  │
│   Node.js + Express.js  │
│                         │
│ ┌─────────────────────┐ │
│ │ Authentication Layer│
│ │ JWT / Google OAuth  │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Authorization Layer │
│ │ RBAC (User/Admin)   │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Encryption Engine   │
│ │ AES (File Encrypt) │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ File Services       │
│ │ Upload / Download  │
│ │ Share / OTP        │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Security Middleware │
│ │ Helmet / RateLimit  │
│ └─────────────────────┘ │
└─────────────┬───────────┘
              │
              ▼

# ===========================
# STORAGE LAYER
# ===========================
┌─────────────────────────┐
│        Storage Layer    │
│ ┌─────────────────────┐│
│ │ MongoDB (Metadata)  ││
│ └─────────────────────┘│
│ ┌─────────────────────┐│
│ │ Local Storage / S3  ││
│ │ Encrypted Files     ││
│ └─────────────────────┘│
└─────────────────────────┘
```

## 📁 Project Structure

### 🖥️ Backend

```
backend/
├── config/                         # Configuration files
│   ├── db.js                       # MongoDB connection
│   └── passport.js                 # Google OAuth configuration
│
├── controllers/                    # Request handlers
│   ├── auth.controller.js          # Authentication logic
│   ├── file.controller.js          # File upload & management
│   ├── share.controller.js         # Secure file sharing
│   ├── otp.controller.js           # OTP generation & validation
│   ├── admin.controller.js         # Admin operations
│   └── downloadFileById.controller.js # Secure file download by ID
│
├── middleware/                     # Custom middleware
│   ├── auth.middleware.js          # JWT authentication
│   ├── admin.middleware.js         # Admin-only access
│   ├── rateLimit.middleware.js     # API rate limiting
│   ├── error.middleware.js         # Centralized error handling
│   └── upload.middleware.js        # File upload handling (Multer)
│
├── models/                         # Database schemas
│   ├── User.js                     # User model
│   ├── file.js                     # File metadata model
│   ├── OTP.js                      # OTP storage
│   ├── shareLink.js                # Shared file links
│   ├── AuditLog.js                 # System audit logs
│   └── AdminNotification.js        # Admin alerts & notifications
│
├── routes/                         # API routes
│   ├── auth.routes.js              # Authentication routes
│   ├── file.routes.js              # File routes
│   ├── share.routes.js             # File sharing routes
│   ├── otp.routes.js               # OTP routes
│   └── admin.routes.js             # Admin routes
│
├── utils/                          # Utility helpers
│   ├── crypto_utils.js             # Cryptographic utilities
│   ├── encryption.js               # AES encryption/decryption
│   ├── generateToken.js            # JWT generation
│   ├── sendEmail.js                # Email service (Nodemailer)
│   ├── s3upload.js                 # AWS S3 upload helper
│   ├── storage.js                  # Storage abstraction
│   └── tokenGenerator.js           # Secure token generation
│
├── cron/                           # Scheduled tasks
│   └── adminReports.cron.js        # Automated admin reports
│
├── uploads_encrypted/              # Encrypted file storage
│
├── server.js                       # Server entry point
└── package.json                    # Backend dependencies
```

### 🌐 Frontend

```
frontend/
├── public/                         # Static assets
│
├── src/
│   ├── api/                        # API configuration & services
│   │   ├── axios.js                # Axios instance & interceptors
│   │   └── admin.api.js            # Admin-related API calls
│   │
│   ├── auth/                       # Authentication helpers
│   │   └── ProtectedRoute.jsx      # Route protection component
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── FileCard.jsx            # File display card
│   │   ├── UploadBox.jsx           # File upload UI
│   │   ├── OTPInput.jsx            # OTP input component
│   │   └── Loader.jsx              # Loading indicator
│   │
│   ├── context/                    # Global state management
│   │   └── AuthContext.jsx         # Authentication context
│   │
│   ├── hooks/                      # Custom React hooks
│   │   └── useIdleLogout.js        # Auto logout on inactivity
│   │
│   ├── pages/                      # Application pages
│   │   ├── Dashboard.jsx           # User dashboard
│   │   ├── Upload.jsx              # File upload page
│   │   ├── MyFiles.jsx             # User files list
│   │   ├── ShareFile.jsx           # File sharing page
│   │   ├── Download.jsx            # Secure file download
│   │   ├── VerifyOTP.jsx           # OTP verification page
│   │   └── admin/                  # Admin pages
│   │       ├── AdminDashboard.jsx  # Admin dashboard
│   │       ├── AdminUsers.jsx      # Manage users
│   │       └── AdminFiles.jsx      # Manage files
│   │
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Application entry point
│
├── vite.config.js                  # Vite configuration
└── package.json                    # Frontend dependencies
```
## ⚙️ Environment Variables

### 🖥️ Backend (`.env`)

```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_base64_encryption_key

CLIENT_URL=http://localhost:5181
FRONTEND_URL=http://localhost:5181
SERVER_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STORAGE=local   # options: local | s3
```

### 📌 Notes
- `ENCRYPTION_KEY` must be a **secure base64-encoded key**
- `JWT_SECRET` should be **long and random**
- Set `STORAGE=s3` when using **AWS S3**
- Never commit `.env` files to GitHub

## ▶️ How to Run Locally

### 1️⃣ Clone the Repository
```
git clone https://github.com/your-username/encrypted-file-share.git
cd encrypted-file-share
```

### 2️⃣ Backend Setup
```
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```

### 🌐 Access the Application
- Frontend: `http://localhost:5181`
- Backend API: `http://localhost:5000`

## 🚀 Future Improvements
- End-to-end encryption
- File versioning
- Virus scanning for uploads
- Download limits & expiry
- Activity dashboard & analytics

## 👨‍💻 Author

**Rohit Kumar**  
Computer Science Engineer  
Specialized in Backend Development & Security  

- GitHub: https://github.com/rohi5431 
- Email: rohitk60316@gmail.com










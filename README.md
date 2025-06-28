# AuthXpress

**AuthXpress** is a robust and secure authentication system designed for modern web applications, featuring powerful **Role-Based Access Control (RBAC)** for secure and flexible user management.

It offers essential features such as:

- User registration and login  
- Forgot password and password reset  
- Refresh token and persistent login  
- Google login and multi-factor authentication  
- Protected routes and feature-level restrictions based on user roles and permissions (backend + frontend)

Built with a powerful **Express.js** backend and an intuitive **React.js** frontend, AuthXpress ensures a seamless user experience while prioritizing data security. Featuring hashed passwords, token-based authentication, and secure storage practices, it’s a **production-ready** solution that integrates easily into modern web applications.


## 🔐 Why Token-Based Authentication?

1. **Stateless** — Scalable and supports cross-domain requests (CORS).
2. **Secure** — Token is stored on the client but always verified on the server.


## ✨ Features

### User Authentication
- Signup and login with secure credential handling
- Multi-factor authentication (e.g. Google Authenticator)

### Reset Password via Email
- Request a reset link via registered email
- Reset token is valid for 1 hour

### Role-Based Access Control (RBAC)
- Create roles and assign permissions
- Restrict access to routes and features based on roles/permissions
- Protect both backend APIs and frontend UI components dynamically

### Persistent Login
- Seamless user sessions even after refreshing the page
- Access and refresh token flow for secure re-authentication

### OAuth Login
- Google login integration for quick and secure authentication


## 🛡️ Security Highlights

- Passwords hashed using bcrypt
- JWT-based authentication
- Route protection and role-based authorization
- Secure storage and token handling best practices


## 📁 Tech Stack

- **Backend**: Express.js, Mongoose, JWT, bcrypt, NodeMailer
- **Frontend**: React.js, React Query, Axios, Formik, Yup, TailwindCSS


## 🚀 Ready to Use

AuthXpress is ideal for any modern web app that needs secure, scalable authentication and access control.


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dinakajoy/authXpress.git
   cd authXpress
   ```
2. Install dependencies in the fronend and backend folders:

```bash
npm install
```

3. Configure environemnt (.env) following .env-example files for frontend and backend
4. Start the development server: `npm start` in the frontend folder
5. Start the development frontend application: `npm run develop` in the backend folder
6. Open the app in your browser: `http://localhost:3000`
7. Ensure backend test passes by running: `npm test` in the backend folder

### Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

- Fork the repository
- Clone your fork the repository
- Create a new branch:  
  `git checkout -b feature-name`
- Make your changes and commit them:  
  `git commit -m "Add feature-name"`
- Push to the branch:  
  `git push origin feature-name`
- Submit a pull request.

### License

This project is licensed under the MIT License.

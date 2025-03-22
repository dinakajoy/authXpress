# authXpress

AuthXpress is a robust and secure authentication system designed for modern web applications, with robust role-based access control (RBAC), ensuring secure and seamless user management. It offers essential features like user registration, login, forgot password, password reset, and refresh token management. With persistent login capabilities, users remain seamlessly authenticated even after refreshing the page. Users can also assign roles and permissions to users.

Built with a powerful Express.js backend and an intuitive React.js frontend, AuthXpress ensures a smooth user experience while prioritizing data security. Featuring hashed passwords, token-based authentication, and secure storage practices, it’s a production-ready solution that integrates seamlessly into your application.

## Why Token-Based Authentication

1. It is Stateless, which makes it hightly scalable because it provides Cross-Domain support
2. Token is stored on the client but it gets verified on the server

## Features

- **User Authentication**
  - Login, Signup, Forgot Password, and Reset Password functionality.
- **Reset Password Via Email**

  - Request for Password reset and get a reset link in your registered email
  - Token with 1 hour validity

- **Responsive Design**
  - Fully responsive UI built with CSS and TailwindCSS for an optimized user experience on all devices.

## Technologies Used

- **Frontend:** React.js, CSS, TailwindCSS
- **Backend:** Express.js, MogoDB, JSON Web Token, NodeMailer

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

## Future Enhancements

- Implement OAuth features like Google Loging, GitHub Login, etc

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

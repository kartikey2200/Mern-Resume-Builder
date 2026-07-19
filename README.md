# Resume Builder

A full-stack Resume Builder application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application enables users to create, edit, preview, and download professional resumes through an intuitive web interface.

The backend follows a modular architecture to improve scalability, maintainability, and code organization.

---

## Features

- User Registration & Login
- JWT Authentication & Authorization
- Create, Edit and Delete Resume
- Multiple Resume Sections
- Live Resume Preview
- Resume Templates
- Download Resume as PDF
- Profile Management
- Responsive User Interface
- RESTful API
- Environment Variable Configuration
- Modular Backend Architecture
- MongoDB Database Integration

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors
- Nodemon

---

## Project Structure

```
Resume-Builder
│
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   ├── context
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   ├── common
│   │   ├── config
│   │   ├── middleware
│   │   ├── modules
│   │   │
│   │   ├── routes
│   │   ├── utils
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resume-builder.git
```

Move into the project directory.

```bash
cd resume-builder
```

---

## Backend Setup

Navigate to the backend folder.

```bash
cd server
```

Install all dependencies.

```bash
npm install
```

Create a `.env` file inside the `server` folder.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server.

```bash
npm run dev
```

Backend will be available at:

```
http://localhost:5000
```

---

## Frontend Setup

Open a new terminal.

```bash
cd client
```

Install dependencies.

```bash
npm install
```

Start the React application.

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | User login |
| GET | `/api/v1/auth/profile` | Get user profile |

### Resume

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/resume` | Create resume |
| GET | `/api/v1/resume` | Get all resumes |
| GET | `/api/v1/resume/:id` | Get resume by ID |
| PUT | `/api/v1/resume/:id` | Update resume |
| DELETE | `/api/v1/resume/:id` | Delete resume |

---

## Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Available Scripts

### Backend

```bash
npm run dev
```

Runs the backend server with Nodemon.

```bash
npm start
```

Runs the backend in production mode.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production-ready frontend.

---

## Future Enhancements

- AI-based Resume Suggestions
- Cover Letter Generator
- Multiple Resume Themes
- Resume Sharing
- Cloud Storage Integration
- Admin Dashboard

---

## Author

**Kartikey Dwivedi**

This project is developed for educational purposes.

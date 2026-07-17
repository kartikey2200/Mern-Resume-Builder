# Resume Builder

A Resume Builder web application built using the MERN Stack. The goal of this project is to provide users with a simple interface to create, edit, and manage professional resumes.

The project is currently under development and new features are being added gradually.

---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- Git & GitHub
- Postman
- Nodemon
- dotenv

---

## Folder Structure

```
Resume-Builder/
│
├── client/
│
└── server/
    ├── src/
    │   ├── config/
    │   ├── common/
    │   ├── middleware/
    │   ├── modules/
    │   ├── routes/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    │
    ├── package.json
    └── .env
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/resume-builder.git
```

Move into the project folder.

```bash
cd resume-builder
```

---

## Backend Setup

Move to the server directory.

```bash
cd server
```

Install dependencies.

```bash
npm install
```

Create a `.env` file inside the server folder.

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

The server will start on:

```
http://localhost:5000
```

---

## Frontend Setup

Open another terminal.

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

## Current Progress

- Basic project structure
- Express server setup
- Modular backend architecture
- Environment configuration
- Route management
- Authentication module structure

---

## Planned Features

- User authentication
- Resume creation
- Resume editing
- Resume templates
- PDF download
- Profile management

---

## Author

Kartikey Dwivedi

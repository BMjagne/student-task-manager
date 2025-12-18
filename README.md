# Student Task Manager

A full-stack web application for students to manage their tasks and assignments efficiently.

## Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Set task priorities (low, medium, high)
- Track task status (pending, in-progress, completed)
- Set due dates for tasks
- User-specific task management

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup Steps

1. **Clone the repository or create the project structure**

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-task-manager
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

4. **Make sure MongoDB is running**
If using local MongoDB:
```bash
mongod
```

5. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected Routes - Require JWT Token)
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a single task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/complete` - Mark task as complete

## Testing with Postman

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```
Copy the token from the response.

### 3. Create a Task
```
POST http://localhost:5000/api/tasks
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "title": "Complete Math Assignment",
  "description": "Solve problems 1-10",
  "dueDate": "2024-12-25",
  "priority": "high",
  "status": "pending"
}
```

### 4. Get All Tasks
```
GET http://localhost:5000/api/tasks
Headers:
  Authorization: Bearer YOUR_TOKEN_HERE
```

## Project Structure

```
student-task-manager/
├── public/                 # Frontend files (HTML, CSS, JS)
├── src/
│   ├── config/
│   │   └── db.js          # Database connection
│   ├── models/
│   │   ├── user.model.js  # User schema
│   │   └── task.model.js  # Task schema
│   ├── controllers/
│   │   ├── auth.controller.js  # Auth logic
│   │   └── task.controller.js  # Task CRUD logic
│   ├── routes/
│   │   ├── auth.routes.js      # Auth routes
│   │   └── task.routes.js      # Task routes
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification
│   │   └── errorHandler.js     # Global error handler
│   ├── server.js          # Express app setup
│   └── index.js           # Entry point
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Next Steps

The backend is now complete! Next phases:
1. Building the frontend HTML pages
2. Style with CSS
3. Add JavaScript for API integration
4. Deploy the application

## License

MIT
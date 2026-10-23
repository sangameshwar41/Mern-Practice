# Student Management System

A MERN Stack application for managing student records.

## Technology Stack

- MongoDB
- Express.js
- React.js
- Node.js

## Project Structure

- client: React frontend built with Vite.
- server: Node.js backend using Express.js.

## Setup Instructions

### Backend

1. Open a terminal.
2. Navigate to the server folder:

   cd server

3. Install dependencies:

   npm install

4. Start the server:

   node server.js

The backend runs at http://localhost:5000.

### Frontend

1. Open another terminal.
2. Navigate to the client folder:

   cd client

3. Install dependencies:

   npm install

4. Start the frontend:

   npm run dev

The frontend runs at http://localhost:5173.

## Database Configuration

This project uses MongoDB Atlas as the database and Mongoose to interact with MongoDB.

### Setup Instructions

1. Create a MongoDB Atlas cluster.
2. Create a database user and configure network access.
3. Navigate to the `server` folder.
4. Create a `.env` file inside the `server` folder.
5. Add your MongoDB connection string to the `.env` file:

   `MONGODB_URI=your_mongodb_connection_string`

6. Replace the placeholder with your own MongoDB Atlas connection string. Do not commit the `.env` file to GitHub.
7. Install the backend dependencies using `npm install`.
8. Start the backend server using `node server.js`.

### Student Model

The Student model includes full name, email, mobile number, gender, course, and address. Email must be unique. The `createdAt` and `updatedAt` fields are generated automatically by Mongoose timestamps.

### API Endpoints

- `POST /students` — creates a student record.
- `GET /students` — retrieves student records.

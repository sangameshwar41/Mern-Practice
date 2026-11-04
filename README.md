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

### File Upload and Storage

This application supports uploading student photos and PDF documents.

#### Student Photos

- Allowed formats: JPG, JPEG, PNG, and WebP.
- Maximum file size: 2 MB.
- Storage location: `server/uploads/students/photos/`.
- Uploaded photos use randomly generated filenames to avoid filename conflicts.

#### Student Documents

- Allowed format: PDF only.
- Maximum file size: 5 MB.
- Storage location: `server/uploads/students/documents/`.
- PDF documents can be uploaded, downloaded, and removed by authorized users.

#### Security and Validation

- The backend validates file extensions and MIME types.
- File size limits are enforced by the upload middleware.
- Authentication and role-based authorization protect upload, removal, and document download operations.
- The backend checks whether files exist before serving them.
- Uploaded files are stored locally during development. For production deployment, use persistent storage or an object storage service.

#### Storage Configuration

The upload folders are created automatically by the backend when the upload middleware is initialized. Ensure that the application has permission to write to these folders.

**Note:** Local uploaded files are not stored in MongoDB. MongoDB stores the file references associated with each student.

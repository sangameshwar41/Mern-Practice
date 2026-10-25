# Student Management System API Documentation

## Base URL

http://localhost:5000

## Student Data Fields

| Field        | Type   | Required |
| ------------ | ------ | -------- |
| fullName     | String | Yes      |
| email        | String | Yes      |
| mobileNumber | String | Yes      |
| gender       | String | Yes      |
| course       | String | Yes      |
| address      | String | Yes      |

## 1. Get All Students

- **Method:** GET
- **Endpoint:** `/api/students`
- **Description:** Retrieves all students.

### Success Response — 200 OK

```json
{
  "success": true,
  "data": [
    {
      "_id": "student_id",
      "fullName": "Test Student",
      "email": "test@example.com",
      "mobileNumber": "9866543122",
      "gender": "Male",
      "course": "MERN Stack Development",
      "address": "Hyderabad"
    }
  ]
}
```

## 2. Get Student by ID

- **Method:** GET
- **Endpoint:** `/api/students/:id`
- **Description:** Retrieves a student using their MongoDB ID.

### Success Response — 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "student_id",
    "fullName": "Test Student",
    "email": "test@example.com",
    "mobileNumber": "9866543122",
    "gender": "Male",
    "course": "MERN Stack Development",
    "address": "Hyderabad"
  }
}
```

### Error Responses

- `400 Bad Request` — Invalid student ID.
- `404 Not Found` — Student does not exist.

## 3. Create Student

- **Method:** POST
- **Endpoint:** `/api/students`
- **Description:** Creates a new student.

### Request Body

```json
{
  "fullName": "Test Student",
  "email": "test@example.com",
  "mobileNumber": "9866543122",
  "gender": "Male",
  "course": "MERN Stack Development",
  "address": "Hyderabad"
}
```

### Success Response — 201 Created

```json
{
  "success": true,
  "data": {
    "_id": "generated_student_id",
    "fullName": "Test Student",
    "email": "test@example.com",
    "mobileNumber": "9866543122",
    "gender": "Male",
    "course": "MERN Stack Development",
    "address": "Hyderabad"
  }
}
```

### Error Responses

- `400 Bad Request` — Required fields are missing or validation fails.
- `409 Conflict` — Email already exists.

## 4. Update Student

- **Method:** PATCH
- **Endpoint:** `/api/students/:id`
- **Description:** Updates selected fields of an existing student.

### Request Body Example

```json
{
  "course": "React Development"
}
```

### Success Response — 200 OK

```json
{
  "success": true,
  "data": {
    "_id": "student_id",
    "fullName": "Test Student",
    "email": "test@example.com",
    "mobileNumber": "9866543122",
    "gender": "Male",
    "course": "React Development",
    "address": "Hyderabad"
  }
}
```

### Error Responses

- `400 Bad Request` — Invalid ID or validation fails.
- `404 Not Found` — Student does not exist.

## 5. Delete Student

- **Method:** DELETE
- **Endpoint:** `/api/students/:id`
- **Description:** Deletes an existing student.

### Success Response — 200 OK

```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

### Error Responses

- `400 Bad Request` — Invalid student ID.
- `404 Not Found` — Student does not exist.

## Common Unexpected Error Response

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Testing

Use Thunder Client to test each endpoint.

For POST and PATCH requests, select **Body → JSON** and send a valid JSON request body.

Use an existing student ID for GET, PATCH, and DELETE requests.

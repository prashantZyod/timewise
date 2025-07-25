# Timewise Backend Server

This is the backend server for the Timewise employee attendance tracking system. It provides API endpoints for managing staff, branches, attendance, devices, and geofences.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository (if you haven't already)
2. Navigate to the server directory:
   ```
   cd timewise/server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/timewise
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=30d
   ```

### Running the Server

To start the server in development mode:
```
npm run dev
```

For production:
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/password` - Change password

### Staff

- `GET /api/staff` - Get all staff
- `GET /api/staff/:id` - Get staff by ID
- `POST /api/staff` - Create new staff
- `PUT /api/staff/:id` - Update staff
- `DELETE /api/staff/:id` - Delete staff
- `GET /api/staff/branch/:branchId` - Get staff by branch

### Branches

- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `POST /api/branches` - Create new branch
- `PUT /api/branches/:id` - Update branch
- `DELETE /api/branches/:id` - Delete branch
- `GET /api/branches/:id/staff` - Get staff in branch
- `GET /api/branches/:id/geofences` - Get geofences for branch

### Attendance

- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance/check-in` - Check in
- `POST /api/attendance/check-out` - Check out
- `POST /api/attendance/update-location` - Update location
- `GET /api/attendance/staff/:staffId` - Get attendance by staff
- `GET /api/attendance/branch/:branchId` - Get attendance by branch
- `GET /api/attendance/stats` - Get attendance statistics
- `GET /api/attendance/reports` - Generate attendance reports

### Devices

- `GET /api/devices` - Get all devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `POST /api/devices/register` - Register device
- `POST /api/devices/:id/approve` - Approve device
- `POST /api/devices/:id/reject` - Reject device
- `GET /api/devices/staff/:staffId` - Get devices by staff

### Geofences

- `GET /api/geofences` - Get all geofences
- `GET /api/geofences/:id` - Get geofence by ID
- `POST /api/geofences` - Create new geofence
- `PUT /api/geofences/:id` - Update geofence
- `DELETE /api/geofences/:id` - Delete geofence
- `GET /api/geofences/branch/:branchId` - Get geofences by branch
- `POST /api/geofences/check` - Check location in geofence
- `GET /api/geofences/custom-premises` - Get custom premises

## Authentication

Authentication is handled using JWT (JSON Web Tokens). Most endpoints require a valid token to be included in the request header:

```
x-auth-token: YOUR_TOKEN_HERE
```

## Middleware

The server uses the following middleware:

- `auth.js` - Authentication middleware to protect routes
- `adminAuth.js` - Additional middleware to restrict access to admin-only routes

## Models

- `User` - User accounts (admins, managers, etc.)
- `Staff` - Staff members (employees)
- `Branch` - Company branches or locations
- `Attendance` - Attendance records
- `Device` - Registered devices
- `Geofence` - Geofence definitions for branches

## Running the Seed Script

To populate the database with sample data:

```
npm run seed
```

This will create sample users, staff, branches, geofences, etc.

## Integration with Frontend

The frontend React application connects to this backend using the API service. Make sure the `REACT_APP_API_URL` environment variable in the frontend points to the correct backend URL.

## License

This project is licensed under the MIT License.

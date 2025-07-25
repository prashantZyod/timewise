# TimeWise Backend API

The backend API for the TimeWise application, providing attendance tracking with geofencing capabilities.

## Features

- User authentication and authorization (admin/staff roles)
- Staff management
- Branch management with geofencing
- Device registration and approval
- Real-time attendance tracking with geofencing
- Custom premise support for geofenced check-ins
- Location tracking and history

## Technology Stack

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Helmet for security headers
- Morgan for HTTP request logging
- Express Validator for input validation
- Bcrypt for password hashing

## Project Structure

```
server/
├── controllers/       # Request handlers
├── middleware/        # Custom middleware
├── models/            # Mongoose data models
├── routes/            # API routes
│   └── api/           # API endpoints
├── utils/             # Utility functions
├── .env               # Environment variables
├── package.json       # Dependencies
├── server.js          # Entry point
└── README.md          # Documentation
```

## API Endpoints

### Users

- `POST /api/users` - Register a new user
- `POST /api/users/login` - Authenticate user & get token
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Staff

- `POST /api/staff` - Create a new staff member (admin only)
- `GET /api/staff` - Get all staff members (admin only)
- `GET /api/staff/:id` - Get staff by ID
- `PUT /api/staff/:id` - Update staff (admin only)
- `DELETE /api/staff/:id` - Delete staff (admin only)
- `GET /api/staff/user/:userId` - Get staff by user ID

### Branches

- `POST /api/branches` - Create a new branch (admin only)
- `GET /api/branches` - Get all branches
- `GET /api/branches/:id` - Get branch by ID
- `PUT /api/branches/:id` - Update branch (admin only)
- `DELETE /api/branches/:id` - Delete branch (admin only)
- `PUT /api/branches/:id/geofence` - Update branch geofence (admin only)

### Attendance

- `POST /api/attendance/check-in` - Staff check-in
- `POST /api/attendance/check-out` - Staff check-out
- `POST /api/attendance/update-location` - Update location tracking data
- `GET /api/attendance/staff/:staffId` - Get attendance for a staff member by date range
- `GET /api/attendance/today/staff/:staffId` - Get today's attendance for a staff member
- `GET /api/attendance/branch/:branchId` - Get attendance by branch and date range (admin only)
- `GET /api/attendance/today/branch/:branchId` - Get today's attendance by branch (admin only)

### Devices

- `POST /api/devices` - Register a new device
- `GET /api/devices` - Get all devices (admin only)
- `GET /api/devices/:id` - Get device by ID
- `PUT /api/devices/:id` - Update device (admin only)
- `DELETE /api/devices/:id` - Delete device (admin only)
- `GET /api/devices/staff/:staffId` - Get devices by staff ID
- `PUT /api/devices/:id/location` - Update device last known location

### Geofences

- `POST /api/geofences` - Create a new geofence (admin only)
- `GET /api/geofences` - Get all geofences (admin only)
- `GET /api/geofences/:id` - Get geofence by ID
- `PUT /api/geofences/:id` - Update geofence (admin only)
- `DELETE /api/geofences/:id` - Delete geofence (admin only)
- `GET /api/geofences/branch/:branchId` - Get geofences by branch
- `POST /api/geofences/check` - Check if location is within geofence

## Setup and Running

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/timewise
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=86400
   NODE_ENV=development
   ```

3. Run the server:
   ```
   npm start
   ```

4. For development with auto-restart:
   ```
   npm run dev
   ```

5. Seed the database with sample data (optional):
   ```
   node utils/seedData.js
   ```

## Testing

To test the API endpoints, you can use tools like Postman or Insomnia.

## Production

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up proper MongoDB authentication
4. Use HTTPS and security best practices

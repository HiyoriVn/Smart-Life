# Smart Life Backend

## Overview
The Smart Life Backend is a Node.js application built with Express and Sequelize ORM to manage users, courses, tasks, schedules, exams, and statistics. It connects to a PostgreSQL database and provides a RESTful API for client applications.

## Project Structure
```
smart-life-backend
├── src
│   ├── config
│   │   └── database.js
│   ├── models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Task.js
│   │   ├── Schedule.js
│   │   ├── Exam.js
│   │   └── Statistics.js
│   ├── routes
│   │   ├── index.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── tasks.js
│   │   ├── schedules.js
│   │   ├── exams.js
│   │   └── statistics.js
│   ├── controllers
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── taskController.js
│   │   ├── scheduleController.js
│   │   ├── examController.js
│   │   └── statisticsController.js
│   └── middleware
│       └── errorHandler.js
├── server.js
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd smart-life-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database:
   - Ensure PostgreSQL is running.
   - Create a database named `smartlife` and set the user and password as specified in the configuration.

## Configuration
- Database connection settings can be found in `src/config/database.js`. Update the credentials if necessary.

## Running the Application
To start the server, run:
```
npm start
```
The server will be available at `http://localhost:3000`.

## API Endpoints
- Users: `/api/users`
- Courses: `/api/courses`
- Tasks: `/api/tasks`
- Schedules: `/api/schedules`
- Exams: `/api/exams`
- Statistics: `/api/statistics`

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
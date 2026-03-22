# Full-Stack React + Node.js + PostgreSQL Application

This is a monorepo containing:
- **Frontend**: React application on `localhost:3000`
- **Backend**: Node.js Express API on `localhost:5000`
- **Database**: PostgreSQL database

## Project Structure
```
ReactAppWS/
├── frontend/        # React application
├── backend/         # Node.js Express server
├── .github/         # Configuration files
└── README.md        # Project documentation
```

## Quick Start
1. Install PostgreSQL locally
2. Install dependencies in both frontend and backend
3. Configure environment variables
4. Start backend server: `npm start` in backend/
5. Start frontend: `npm start` in frontend/

## Development Notes
- Frontend uses React with Axios for API calls
- Backend uses Express.js with PostgreSQL
- Both run on localhost for local development
- API runs on port 5000, Frontend on port 3000

# 🏥 Vayu Clinic - Healthcare Website

A modern, responsive medical clinic website built with React frontend and Node.js backend. Inspired by Neo Asian Clinics, this website showcases comprehensive healthcare services with a professional design and user-friendly interface.

## 🎯 Features

### 🏥 **Medical Clinic Website**
- **Hero Section**: Eye-catching landing with clinic branding
- **Services Section**: Multiple specialties in one location
- **Patient Testimonials**: Real reviews with star ratings
- **Appointment Booking**: Contact form for scheduling visits
- **Clinic Information**: Operating hours and contact details
- **Social Media Integration**: Facebook, YouTube, Instagram, Google Reviews

### 💻 **Technical Features**
- **Frontend**: Modern React application with responsive design
- **Backend**: Node.js Express API with PostgreSQL database
- **Google Maps Integration**: Location display (configurable)
- **Mobile-First Design**: Optimized for all devices
- **Professional UI/UX**: Healthcare-focused design patterns

## 📋 Project Structure

```
ReactAppWS/
├── frontend/                    # React clinic website
│   ├── public/
│   │   └── index.html          # SEO optimized HTML
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.js        # Landing section
│   │   │   ├── Hero.css
│   │   │   ├── Services.js    # Medical services
│   │   │   ├── Services.css
│   │   │   ├── Testimonials.js # Patient reviews
│   │   │   ├── Testimonials.css
│   │   │   ├── Contact.js     # Appointment booking
│   │   │   ├── Contact.css
│   │   │   ├── Footer.js      # Site footer
│   │   │   └── Footer.css
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Global styles
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env                   # Environment config
├── backend/                   # Node.js API server
│   ├── src/
│   │   ├── server.js          # Express server
│   │   └── db.js              # PostgreSQL connection
│   ├── package.json
│   └── .env                   # Database config
├── database/
│   └── init.sql               # Database schema
├── CONFIG.md                  # Configuration guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12+) - [Download](https://www.postgresql.org/download/)

### Installation & Setup

1. **Clone & Navigate**:
   ```bash
   cd ReactAppWS
   ```

2. **Database Setup**:
   ```bash
   # Initialize PostgreSQL database
   psql -U postgres -h localhost -f database/init.sql
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Frontend Setup** (New Terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```

### 🌐 Access URLs
- **Clinic Website**: http://localhost:3000
- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🏥 Clinic Features

### **Services Offered**
- 🦷 **Dental Care** - Painless treatments
- 👨‍⚕️ **General Medicine** - Comprehensive healthcare
- 👩‍⚕️ **Pediatrics** - Child healthcare
- 🩺 **Diagnostics** - Advanced testing
- 💊 **Pharmacy** - Quality medicines
- 🚑 **Emergency Care** - 24/7 support

### **Clinic Information**
- 📍 **Location**: Kondapur, Hyderabad, Telangana
- 📞 **Contact**: +91 79952 77737
- 🕒 **Timings**: Mon-Sat: 8AM-9:30PM, Sun: 8AM-9PM

### **Patient Features**
- ⭐ **Google Reviews Integration**
- 📱 **WhatsApp Contact**
- 📧 **Appointment Booking**
- 📱 **Social Media Presence**

## ⚙️ Configuration

### Google Maps (Optional)
Control maps display in `frontend/.env`:
```env
REACT_APP_MAPS_ENABLED=true  # Enable maps
REACT_APP_MAPS_ENABLED=false # Disable maps
```

### Environment Variables
**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
REACT_APP_MAPS_ENABLED=true
```

**Backend** (`.env`):
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=react_app_db
DB_SSL=false
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me
CORS_ALLOWED_ORIGINS=http://localhost:3000
API_RATE_LIMIT_MAX=200
```

## 🎨 Design Highlights

- **Medical Theme**: Professional healthcare color scheme
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: CSS transitions and hover effects
- **Accessibility**: Proper contrast and focus states
- **Performance**: Optimized React components

## 📱 Mobile Responsive

The website is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1200px+)

## 🔧 Development

### Available Scripts

**Frontend**:
```bash
npm start    # Development server
npm build    # Production build
npm test     # Run tests
```

**Backend**:
```bash
npm start    # Start server
npm dev      # Development with nodemon
```

### Tech Stack
- **Frontend**: React 18, CSS3, Responsive Design
- **Backend**: Node.js, Express.js, PostgreSQL
- **Maps**: Google Maps API (optional)
- **Deployment**: Ready for Vercel/Netlify + Heroku

## 📞 Contact & Support

**Clinic Contact**:
- Phone: +91 79952 77737
- Location: Kondapur, Hyderabad

**Technical Support**:
- Issues: Check CONFIG.md for troubleshooting
- Database: See DATABASE_SETUP.md

---

**🏥 Neo Asian Clinics** - Your Healthcare Partners in Kondapur
- **npm** (comes with Node.js)

### Step 1: Set Up PostgreSQL Database

Follow the detailed instructions in [DATABASE_SETUP.md](./DATABASE_SETUP.md) to create and initialize the database.

Quick version:
```bash
psql -U postgres -h localhost -f database/init.sql
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Configure Backend Environment

The `.env` file is already configured with default values. If your PostgreSQL password is different, update it:

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=react_app_db
```

### Step 4: Start the Backend Server

```bash
cd backend
npm start
```

Expected output:
```
Server is running on http://localhost:5000
```

### Step 5: Install Frontend Dependencies

In a new terminal:
```bash
cd frontend
npm install
```

### Step 6: Start the Frontend Application

```bash
cd frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Available Endpoints

#### Get All Users
```
GET /users
```
Response: Array of user objects

#### Get User by ID
```
GET /users/:id
```
Response: Single user object

#### Create New User
```
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Update User
```
PUT /users/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Delete User
```
DELETE /users/:id
```

#### Health Check
```
GET /health
```
Response: Server status

## 🧪 Testing the Application

1. **Add a User**: Fill in the form on the right side with a name and email, then click "Add User"
2. **View Users**: The users list will automatically update on the right side
3. **Delete a User**: Click the "Delete" button next to any user
4. **Backend Health Check**: Visit `http://localhost:5000/api/health` in your browser

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Development

### Available Commands

**Frontend:**
```bash
npm start   # Start development server
npm build   # Build for production
npm test    # Run tests
```

**Backend:**
```bash
npm start   # Start server
npm run dev # Start with nodemon (auto-restart)
```

### For Development with Hot Reload (Backend)

Install nodemon globally (optional):
```bash
npm install -g nodemon
```

Then use:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

**Backend (.backend/.env)**
- `PORT`: Server port (default: 5000)
- `DB_USER`: PostgreSQL username
- `DB_PASSWORD`: PostgreSQL password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name

**Frontend (.frontend/.env)**
- `REACT_APP_API_URL`: Backend API URL

## ⚠️ Troubleshooting

### Backend Connection Issues

**"ECONNREFUSED" errors:**
- Make sure PostgreSQL is running
- Verify database credentials in `.env`
- Check that the database `react_app_db` exists

**"Port 5000 already in use":**
```bash
# Find and kill the process
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Frontend Connection Issues

**"Failed to fetch users" error:**
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify the API URL in the app

**CORS Errors:**
- Backend has CORS enabled for all origins
- If still having issues, check backend server logs

### Database Issues

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for comprehensive database troubleshooting.

## 📚 Technology Stack

- **Frontend**: React 18 (JavaScript UI library), Axios (HTTP client), CSS3 (styling)
- **Backend**: 
  - Node.js (JavaScript runtime)
  - Express.js (web framework on top of Node.js)
  - Body Parser (middleware), CORS (cross-origin support)
- **Database**: PostgreSQL (relational database)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RESTful API Design](https://restfulapi.net/)

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Support

For issues or questions, please refer to the troubleshooting section above or check the specific documentation files included in the project.

---

**Happy Coding! 🚀**

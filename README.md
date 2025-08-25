# Store Rating System

## Tech Stack

- **Backend**: Express.js
- **Database**: PostgreSQL
- **Frontend**: React.js with Tailwind CSS

## Database Schema

### Users Table
```sql
users (id, name, email, password, address, role)
```

### Stores Table
```sql
stores (id, name, email, address, owner_id, avg_rating)
```

### Ratings Table
```sql
ratings (id, store_id, user_id, rating)
```

## Project Setup

### Backend Setup (Port 5000)  http://localhost:5000      
```bash
cd server
npm install
npm start
```

### Frontend Setup (Port 3000)  http://localhost:3000      
```bash
cd client
npm install
npm start
```

## Authentication

- JWT-based authentication system
- Role-based access control
- Bcrypt password hashing

## Features

### System Administrator

**Dashboard:**
- Total users, stores, and ratings overview
- Store management with average ratings
- User management with filtering options
- Add new stores and users

**Capabilities:**
- Add/manage stores
- Add/manage users (Normal/Admin roles)
- View detailed analytics
- Sort and filter data

### Normal User

**Features:**
- User registration and login
- Password update
- Store search by name/address
- View store ratings
- Submit and modify ratings

**Store Information:**
- Store name and address
- Overall rating display
- Personal rating tracking

### Store Owner

**Dashboard:**
- View users who rated their store
- Monitor average store rating
- Password management

## Screenshots

### Authentication
![Login](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/login.png?raw=true)

### Admin Dashboard
![Admin Home](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/adminhome.png?raw=true)
![User Management](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/userAdminDash.png?raw=true)
![Add User](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/adduser.png?raw=true)
![Add Store](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/addStore.png?raw=true)
![Store List](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/storeListAdmin.png?raw=true)

### User Dashboard
![User Dashboard](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/UserDash.png?raw=true)

### Store Owner Dashboard
![Store Dashboard](https://github.com/VaishnaviBarge/Roxiler-Assignment2/blob/main/storeDashboard.png?raw=true)

-For any questions or doubts, please contact: vaishnavibarge0@gmail.com

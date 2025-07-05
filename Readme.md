# 📚 Minimal Library Management System

A modern, full-stack **Library Management System** built with TypeScript, React, Redux Toolkit Query, and Node.js. This application provides a complete solution for managing book collections with features for creating, updating, borrowing, and tracking books through a clean, minimal interface.

---

## 🚀 Live Demo & Links

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Frontend App** | [https://assignment-4-redux-ph-l-2-ideh.vercel.app](https://assignment-4-redux-ph-l-2-ideh.vercel.app) | Main application interface |
| ⚙️ **Backend API** | [https://assignment-4-redux-ph-l-2.vercel.app/api](https://assignment-4-redux-ph-l-2.vercel.app/api) | REST API endpoints |
| 📖 **Backend API Documentation** | [https://github.com/muhamash/assignment-4-redux-ph-l-2/blob/main/backend-library/README.md](https://github.com/muhamash/assignment-4-redux-ph-l-2/blob/main/backend-library/README.md) | Interactive API docs (Readme) | 
|📖 **Frontend API Documentation** | [https://github.com/muhamash/assignment-4-redux-ph-l-2/blob/main/frontend-library/README.md](https://github.com/muhamash/assignment-4-redux-ph-l-2/blob/main/frontend-library/README.md) | Interactive Web docs (Readme) |
| 🐙 **Repository** | [https://github.com/muhamash/assignment-4-redux-ph-l-2](https://github.com/muhamash/assignment-4-redux-ph-l-2) | Source code |

---

## 🏗️ Project Architecture

```
library-management/
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── store/           # Redux store & RTK Query
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Helper functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js + Express Backend
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── docs/                    # Additional documentation
└── README.md               # This file
```

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit Query (RTK Query)
- **Form Handling**: React Hook Form + Zod validation
- **UI Framework**: Tailwind CSS + Shadcn/UI components
- **Routing**: React Router DOM v6
- **Notifications**: Sonner (toast notifications)
- **HTTP Client**: RTK Query (built on Redux Toolkit)

### 💻 Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schema validation
- **Documentation**: Swagger/OpenAPI 3.0
- **CORS**: Express CORS middleware
- **Environment**: dotenv for configuration

---

## ✨ Features

### 📚 Book Management
- **Create Books**: Add new books with title, author, ISBN, and availability status
- **View Books**: Browse all books with detailed information and status indicators
- **Update Books**: Edit book information with real-time validation
- **Delete Books**: Remove books with confirmation dialogs
- **Search & Filter**: Find books by title, author, or availability status

### 📊 Library Analytics
- **Borrow Summary**: View aggregated statistics of borrowed books
- **Status Tracking**: Real-time availability status for all books
- **Book Counters**: Total books, available books, and borrowed books count

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Comprehensive error messages and fallback UI
- **Toast Notifications**: Success and error notifications for all actions
- **Form Validation**: Real-time validation with clear error messages

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Yarn or npm package manager
- Git for version control

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/library-management.git
   cd library-management
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and other configs
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your backend API URL
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Docs: http://localhost:3000/docs

---

## 📚 API Documentation

### Base URL
```
https://library-mgmt-api.herokuapp.com/api/v1
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/books` | Get all books |
| `POST` | `/books` | Create a new book |
| `GET` | `/books/:id` | Get book by ID |
| `PUT` | `/books/:id` | Update book |
| `DELETE` | `/books/:id` | Delete book |
| `GET` | `/books/summary` | Get borrowing summary |
| `PATCH` | `/books/:id/borrow` | Borrow/return book |

### Sample Request/Response

**Create Book**
```bash
POST /api/v1/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "availableQuantity": 3
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "availableQuantity": 3,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🏃‍♂️ Development

### Frontend Development
```bash
cd frontend
npm run dev        
npm run build        
npm run preview      


```

### Backend Development
```bash
cd backend
npm run dev          
npm run build        # Build TypeScript
npm run start       
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend (Vercel)
```bash

npm i -g vercel

# Deploy
cd backend
vercel --prod
```

---

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL = "http://localhost:3000/api"
```

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library-management
ACCESS_TOKEN_SECRET = "ACCESS_TOKEN_SECRET"
REFRESH_TOKEN_SECRET = "REFRESH_TOKEN_SECRET"
```

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@muhamash](https://github.com/muhamash)
- Email: muhammad-ashraful@outlook.com

---

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Inspired by modern library management systems
- Built with ❤️ for the developer community

---

## 🔮 Future Enhancements

- [ ] User authentication and role-based access
- [ ] Book reservation system
- [ ] Advanced search with filters
- [ ] Email notifications for overdue books
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Analytics dashboard
- [ ] Book recommendations engine

---
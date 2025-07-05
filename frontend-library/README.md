# 💻 Library Management System Frontend (React + TypeScript)

Built with **React**, **TypeScript**, **Tailwind CSS**, **RTK Query**, and **shadcn/ui** for a modern, professional user experience.

---

## ✨ Overview

This is the **frontend client** for the Library Management System, providing a sleek, modern, and professional user interface with advanced design and interaction features. The application focuses on essential book and borrowing functionality without authentication complexity, delivering a clean and intuitive user experience.

---

## 🚀 Features

### **📚 Core Functionality**

- **Complete Book Management:** View, add, edit, and delete books with real-time updates
- **Interactive Borrowing System:** Borrow books with availability validation and business logic
- **Aggregated Summaries:** View borrowed books with total quantity tracking
- **Responsive Design:** Fully responsive layout for mobile, tablet, and desktop
- **Professional UI:** Modern components using shadcn/ui and Tailwind CSS

### **🎯 Key Highlights**

- **No Authentication Required:** All features accessible without login
- **Real-time Updates:** Optimistic UI updates for smooth user experience
- **Type-Safe:** Full TypeScript implementation with proper typing
- **Modern Stack:** Latest React patterns with RTK Query for state management
- **Beautiful UX:** Toast notifications, smooth animations, and elegant interactions

---

## 🗺️ Pages & Features

### **🏠 Home Page**
- **Landing Page:** Introduction with featured books and system overview
- **Quick Navigation:** Easy access to all major features
- **Book Highlights:** Showcase of available books with attractive cards

### **📖 Books Management**
- **Books List:** Responsive table/grid view with shadcn/ui components
- **Book Details:** Full detail view with availability, metadata, and descriptions
- **Add Book:** Modal/page form for creating new books
- **Edit Book:** Pre-filled form with existing book data for updates
- **Delete Book:** Confirmation dialog before removal

### **📋 Book List Features**
- **Table View:** Professional table with sortable columns
- **Action Buttons:** Edit, Delete, Borrow, and View details
- **Availability Status:** Visual indicators for book availability
- **Real-time Updates:** Instant UI reflection of changes

### **📚 Borrowing System**
- **Borrow Form:** Interactive form with validation
- **Availability Check:** Real-time validation against available copies
- **Due Date Selection:** Date picker with future date validation
- **Success Feedback:** Toast notifications and redirects

### **📊 Borrow Summary**
- **Aggregated Data:** Total quantity borrowed per book
- **Clean Display:** Table format with book titles, ISBN, and totals
- **Real-time Updates:** Automatic refresh from API aggregation

---

## 🌟 UI Components (shadcn/ui)

### **🎨 Component Library**
- **Buttons:** Various styles and states with loading indicators
- **Dialogs:** Modal confirmations for destructive actions
- **Tables:** Responsive data tables with sorting and actions
- **Forms:** Advanced form components with validation
- **Alerts:** Toast notifications for user feedback
- **Cards:** Book display cards with elegant layouts

### **🔧 Advanced Features**
- **Loading States:** Skeleton loaders and spinners
- **Error Boundaries:** Graceful error handling
- **Animations:** Smooth transitions and micro-interactions
- **Responsive Design:** Mobile-first approach with breakpoints

---

## 📱 Page Structure

| **Route** | **Description** | **Features** |
|-----------|-----------------|--------------|
| `/` | Landing/Home page | Featured books, navigation, overview |
| `/books` | All books display | Table/grid view, search, actions |
| `/books/:id` | Book details | Full information, borrow option |
| `/create-book` | Add new book | Form with validation |
| `/borrow-summary` | Borrowed books summary | Aggregated data display |

---

## ⚙️ Technology Stack

| **Layer** | **Technology** | **Purpose** |
|-----------|----------------|-------------|
| **Frontend Framework** | React 18 | Component-based UI library |
| **Language** | TypeScript | Static typing and enhanced developer experience |
| **State Management** | Redux Toolkit + RTK Query | Data fetching, caching, and state management |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Modern, accessible component library |
| **Form Handling** | React Hook Form | Efficient form state management |
| **Validation** | Zod | Runtime type checking and validation |
| **Notifications** | Sonner | Toast notifications |
| **Icons** | Lucide React | Beautiful, customizable icons |
| **Build Tool** | Vite | Fast development and build tool |

---

### **🔧 Key Features**

#### **RTK Query Integration**
- **API Endpoints:** Fully typed API calls with automatic caching
- **Optimistic Updates:** Smooth UI updates before API confirmation
- **Error Handling:** Comprehensive error states and retry logic
- **Background Refetching:** Automatic data synchronization

#### **Type Safety**
- **TypeScript:** Full type coverage throughout the application
- **Zod Validation:** Runtime type checking for API responses
- **Type-Safe Forms:** Strongly typed form inputs and validation

#### **Performance Optimizations**
- **Code Splitting:** Lazy loading for optimal bundle size
- **Memoization:** React.memo and useMemo for performance
- **Efficient Renders:** Optimized component re-renders

---

## 🎨 UI/UX Highlights

### **🌈 Design System**
- **Consistent Colors:** Tailwind CSS color palette with dark mode support
- **Typography:** Elegant font choices with proper hierarchy
- **Spacing:** Consistent spacing using Tailwind's spacing scale
- **Animations:** Smooth transitions and micro-interactions

### **📱 Responsive Design**
- **Mobile-First:** Optimized for mobile devices
- **Tablet Support:** Proper layout for tablet screens
- **Desktop Experience:** Full-featured desktop interface
- **Touch-Friendly:** Appropriate touch targets and interactions

### **♿ Accessibility**
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Reader Support:** Proper ARIA labels and descriptions
- **Color Contrast:** WCAG compliant color combinations
- **Focus Management:** Clear focus indicators

---

## 🚀 Getting Started

### **📋 Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

### **⚙️ Installation**

```bash
# Clone the repository
git clonehttps://github.com/muhamash/assignment-4-redux-ph-l-2.git
cd library-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env

# Start development server
npm run dev
```

### **🔧 Environment Variables**

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api
```

### **🏗️ Build & Deployment**

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📊 API Integration

### **🔗 RTK Query Setup**

```typescript
// store/api/booksApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VITE_API_BASE_URL,
  }),
  tagTypes: ['Book', 'Borrow'],
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, BooksQuery>({
      query: (params) => ({
        url: '/books',
        params,
      }),
      providesTags: ['Book'],
    }),
    // ... other endpoints
  }),
})
```

### **💡 Example API Interactions**

#### **Borrow Book Request**
```json
{
  "book": "64f12a4abc4567890def0001",
  "quantity": 1,
  "dueDate": "2025-07-20T00:00:00.000Z"
}
```

#### **Borrow Book Response**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "book": "64f12a4abc4567890def0001",
    "quantity": 1,
    "dueDate": "2025-07-20T00:00:00.000Z",
    "createdAt": "2025-07-04T23:34:52.831Z",
    "updatedAt": "2025-07-04T23:34:52.831Z"
  }
}
```

---

## 🎯 Bonus Features Implemented

| **Feature** | **Status** | **Description** |
|-------------|------------|-----------------|
| **Optimistic UI Updates** | ✅ | Instant UI updates before API confirmation |
| **Toast Notifications** | ✅ | Success/error messages with Sonner |
| **Responsive Layout** | ✅ | Mobile-first responsive design |
| **Type-Safe Forms** | ✅ | Zod validation with TypeScript |
| **Loading States** | ✅ | Skeleton loaders and spinners |
| **Error Boundaries** | ✅ | Graceful error handling |

---

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:host     # Start dev server with network access

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Testing & Quality
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run e2e          # Run e2e tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
npm run type-check   # TypeScript type checking

# Maintenance
npm run clean        # Clean build files
npm run analyze      # Analyze bundle size
```

---

## 🛡️ Error Handling

### **📱 User-Friendly Errors**
- **Form Validation:** Clear field-level error messages
- **API Errors:** Meaningful error notifications
- **Network Issues:** Offline detection and retry options
- **404 Errors:** Custom not found pages

### **🔧 Developer Experience**
- **Error Boundaries:** Catch and handle React errors
- **Console Logging:** Detailed error information in development
- **Source Maps:** Proper error stack traces

---

## 🎨 Component Examples

### **📚 Book Card Component**
```tsx
interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onBorrow: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onBorrow,
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        <CardDescription>by {book.author}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant="secondary">{book.genre}</Badge>
          <p className="text-sm text-muted-foreground">
            Available: {book.copies} copies
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button size="sm" onClick={() => onEdit(book)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(book._id)}>
          Delete
        </Button>
        <Button size="sm" variant="outline" onClick={() => onBorrow(book)}>
          Borrow
        </Button>
      </CardFooter>
    </Card>
  );
};
```

---

## 🚀 Performance Optimizations

- **Code Splitting:** Lazy loading of routes and components
- **Bundle Analysis:** Webpack bundle analyzer integration
- **Image Optimization:** Responsive images with lazy loading
- **Caching:** RTK Query automatic caching and background updates
- **Memoization:** Strategic use of React.memo and useMemo

---

## 🌐 Browser Support

- **Chrome:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **Edge:** Latest 2 versions
- **Mobile:** iOS Safari, Chrome Mobile

---
---

## 🛜 Links

- **Frontend Repository:** https://github.com/muhamash/library-frontend
- **Backend Repository:** https://github.com/muhamash/library-api-express-ts-monggose
- **Live Demo:** [Coming Soon]
- **Author:** https://github.com/muhamash
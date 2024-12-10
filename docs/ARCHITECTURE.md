# **GreatReads Monorepo Architecture**

## **Overview**

GreatReads is a feature-rich **Next.js** application leveraging the **App Router** for routing and server-side capabilities. It serves as a reading hub where users can search for books, track their reading progress, organize books into custom bookshelves, and add personal notes. The application is deployed using **Vercel** for seamless CI/CD.

This document outlines the monorepo structure, key packages/modules, and their architectural roles.

---

## **Monorepo Structure**

```plaintext
src
├── app
│   ├── api/                 # API integration logic
│   │   ├── google_books/    # Google Books API wrapper
│   │   └── supabase/        # Supabase-related DB operations
│   ├── login/               # Authentication flow (Google OAuth via Supabase)
│   ├── provider.tsx         # App-wide providers (React Query, Theme)
│   ├── theme.ts             # Theme and styling configuration
│   ├── globals.css          # Global TailwindCSS styles
│   └── welcome/             # Welcome page for unauthenticated users
├── components/
│   ├── common/              # Reusable UI components (e.g., NavBar, BookImage)
│   ├── ui/                  # UI utilities (e.g., color-mode toggle)
│   ├── popup.tsx            # Modal-like UI component for detailed interactions
│   └── BookshelvesPanel.tsx # Sidebar component for managing bookshelves
├── middleware.ts            # Middleware for authentication and session handling
├── utils/                   # Utility functions (DB, typing, Supabase client)
│   ├── supabase/            # Supabase client and server utilities
│   └── types.ts             # Global TypeScript types
```

---

## **Architectural Details**

### **1. API Layer**

- **Location**: `src/app/api/`
- **Description**: Encapsulates external API and database interaction logic, ensuring clean separation from the UI layer.
    - **Google Books API** (`google_books/books.ts`): Handles book search functionality.
    - **Supabase API** (`supabase/`): Manages operations on user books, bookshelves, and profiles using **Supabase SDK**.

### **2. State Management**

- **Library**: **TanStack Query** (React Query)
- **Custom Hooks**:
    - Each API endpoint is wrapped in a custom hook (e.g., `useCreateBookshelf`, `useUserBookshelves`) for efficient and declarative data fetching.
    - Automatic cache invalidation ensures consistent UI updates.

### **3. Authentication**

- **Implementation**:
    - **Middleware** (`middleware.ts`): Checks user authentication via cookies and redirects unauthenticated users to the welcome page.
    - **Supabase OAuth**: Google login integration with session persistence using Supabase's server-side utilities.

### **4. Database**

- **Backend**: **Supabase PostgreSQL**
- **Schema**:
    - `bookshelf`: Stores user-created bookshelf data.
    - `user_book`: Tracks user-specific book data (e.g., read status, notes, ratings).
    - `z_book`: Contains metadata about books fetched from Google Books.
- **Relationships**:
    - Example: `bookshelf_book` links bookshelves to books using foreign keys.

### **5. Styling**

- **Framework**: **TailwindCSS**
- **Customizations**:
    - Theme configurations in `theme.ts` align with brand guidelines.
    - Responsive design utilities ensure a consistent experience across devices.

### **6. CI/CD**

- **Platform**: **Vercel**
- **Pipeline**:
    - Automatic deployments from the main branch.
    - Build command: `next build`.
    - Preview URLs for feature branches.

---

## **Key Features**

### **Bookshelves**
- Create, update, delete, and organize books into custom bookshelves.
- API hooks:
    - `useCreateBookshelf`
    - `useUpdateBookshelfName`
    - `useDeleteBookshelf`
    - `useUserBookshelves`

### **Search**
- Search for books using Google Books API.
- Search bar and results dynamically rendered using `useBooks`.

### **Authentication**
- Redirect unauthenticated users to `/welcome`.
- Authentication middleware ensures smooth transitions between pages.

### **User Book Management**
- Track reading progress with read statuses (`WANT_TO_READ`, `READING`, `READ`, `UNREAD`).
- Add notes and ratings to books.

---

## **Development Practices**

### **Testing**
- Unit testing is advised using **Jest** or **React Testing Library** for hooks and components.
- End-to-end testing can be implemented with **Cypress** for user flows.

### **Error Handling**
- Native JavaScript error handling and API-specific try-catch blocks.
- Consider integrating **Sentry** for error monitoring in production.

---

This modular architecture ensures scalability and maintainability, enabling GreatReads to evolve with new features while maintaining a clean separation of concerns.
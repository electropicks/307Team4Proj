# GreatReads

## The Project

The purpose of this project is to provide users with a way to track and organize their reading habits. This project focuses on the individual user and their personal reading experience. Users are able to create their own accounts, search for books and organize bookshelves of books. The search capability can search for thousands of books and users can add any book to their bookshelves. With each search result they can interact with books and view their information, including the author and a description of the book. A user can mark a book as read or unread, add personal notes about the book, and add or remove books to and from their shelves.

## UI Prototype
[Figma design](https://www.figma.com/proto/qOQembiYzIe3g3mNLo4mfc/GreatReads?node-id=9-93&node-type=canvas&t=wKYz9QlopHNVvFKZ-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=9%3A172&show-proto-sidebar=1)
*Last updated: November 23, 2024*

## Architecture Documentation
[Documentation folder](docs)

## Development Environment

### Getting Started

First, run the development server:

```bash
    npm install
    npm run dev
```

### Syncing Supabase Types with Database Schema
Having run `npm install` and logged in to Supabase on your default browser, run the following commands:
```bash
    supabase login
    supabase link # Follow CLI instructions and select GreatReadsWebApp
    supabase gen types typescript --linked --schema=public > src/utils/database.types.ts  
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
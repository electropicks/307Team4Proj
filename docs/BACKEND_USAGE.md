# Backend API Interface Usage Guide

> For Frontend Development

## Overview

This document provides a guide for interacting with the Supabase and Google Books API through our backend utilities.
Each section includes a description of the available APIs, their respective hooks, and how to use them in your
components.

---

## Table of Contents

1. [Creating a Bookshelf](#1-creating-a-bookshelf)
2. [Fetching All User Bookshelves](#2-fetching-all-user-bookshelves)
3. [Deleting a Bookshelf](#3-deleting-a-bookshelf)
4. [Updating a Bookshelf Name](#4-updating-a-bookshelf-name)
5. [Adding a Book to a Bookshelf](#5-adding-a-book-to-a-bookshelf)
6. [Removing a Book from a Bookshelf](#6-removing-a-book-from-a-bookshelf)
7. [Fetching Books for a Bookshelf](#7-fetching-books-for-a-bookshelf)
8. [Fetching a Single Book from Google Books API](#8-fetching-a-single-book-in-detail-from-google-books-api)
9. [Notes for Developers](#notes-for-developers)

---

## Directory Structure

- **`src/app/api/supabase/`**: Contains Supabase-related functions and hooks.
    - `bookshelves.ts`: For managing bookshelves.
    - `userBooks.ts`: For managing user-specific books.
    - `utils.ts`: Utility functions for common tasks.
- **`src/app/api/books.ts`**: Handles interactions with the Google Books API.

---

## Workflows and Corresponding APIs

### 1. **Creating a Bookshelf**

- **API Function**: `createBookshelf`
- **Hook**: `useCreateBookshelf`

Use this to create a new bookshelf for the current user.

```typescript
import { useCreateBookshelf } from '@/app/api/supabase';

const SomeComponent = () => {
  const { mutate: createBookshelf, isPending } = useCreateBookshelf();
  const handleCreateBookshelf = () => {
    createBookshelf('My New Bookshelf', {
      onSuccess: () => {
        console.log('Bookshelf created successfully!');
      },
      onError: (error) => {
        console.error('Error creating bookshelf:', error);
      },
    });
  };

  return;
  <button onClick={handleCreateBookshelf}>Create Bookshelf</button>;
};
```

---

### 2. **Fetching All User Bookshelves**

- **API Function**: `getUserBookshelves`
- **Hook**: `useUserBookshelves`

Retrieve all bookshelves belonging to the current user.

```typescript
import { useUserBookshelves } from '@/app/api/supabase';

const BookshelvesList = () => {
  const { data: bookshelves, isLoading } = useUserBookshelves();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {bookshelves?.map((shelf) => (
        <li key={shelf.bookshelf_id}>{shelf.bookshelf_name}</li>
      ))}
    </ul>
  );
};
```

---

### 3. **Deleting a Bookshelf**

- **API Function**: `deleteBookshelf`
- **Hook**: `useDeleteBookshelf`

Delete a bookshelf by its ID.

```typescript
import { useDeleteBookshelf } from '@/app/api/supabase';

const DeleteBookshelfButton = ({ bookshelfId }: { bookshelfId: number }) => {
  const { mutate: deleteBookshelf, isPending } = useDeleteBookshelf();

  const handleDeleteBookshelf = () => {
    deleteBookshelf(bookshelfId, {
      onSuccess: () => {
        console.log('Bookshelf deleted successfully!');
      },
      onError: (error) => {
        console.error('Error deleting bookshelf:', error);
      },
    });
  };

  return (
    <button onClick={handleDeleteBookshelf} disabled={isPending}>
      Delete Bookshelf
    </button>
  );
};
```

---

### 4. **Updating a Bookshelf Name**

- **API Function**: `updateBookshelfName`
- **Hook**: `useUpdateBookshelfName`

Update the name of an existing bookshelf.

```typescript
import { useUpdateBookshelfName } from '@/app/api/supabase';
import { useState } from 'react';

const UpdateBookshelfNameForm = ({ bookshelfId }: { bookshelfId: number }) => {
  const [newName, setNewName] = useState('');
  const { mutate: updateBookshelfName, isPending } = useUpdateBookshelfName();

  const handleUpdateBookshelfName = () => {
    updateBookshelfName(
      { bookshelfId, newBookshelfName: newName },
      {
        onSuccess: () => {
          console.log('Bookshelf updated successfully!');
        },
        onError: (error) => {
          console.error('Error updating bookshelf:', error);
        },
      },
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="New Bookshelf Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={handleUpdateBookshelfName} disabled={isPending}>
        Update Bookshelf Name
      </button>
    </div>
  );
};
```

---

### 5. **Adding a Book to a Bookshelf**

- **API Function**: `addBookToBookshelf`
- **Hook**: `useAddBookToBookshelf`

Add a specific Google Book to a bookshelf.

```typescript
import { useAddBookToBookshelf } from '@/app/api/supabase';

const AddBookButton = ({
  bookshelfId,
  googleBookId,
}: {
  bookshelfId: number;
  googleBookId: string;
}) => {
  const { mutate: addBookToBookshelf, isPending } = useAddBookToBookshelf();

  const handleAddBook = () => {
    addBookToBookshelf(
      { bookshelfId, googleBookId },
      {
        onSuccess: () => {
          console.log('Book added to bookshelf!');
        },
        onError: (error) => {
          console.error('Error adding book:', error);
        },
      },
    );
  };

  return (
    <button onClick={handleAddBook} disabled={isPending}>
      Add Book to Bookshelf
    </button>
  );
};
```

---

### 6. **Removing a Book from a Bookshelf**

- **API Function**: `removeBookFromBookshelf`
- **Hook**: `useRemoveBookFromBookshelf`

Remove a specific book from a bookshelf.

```typescript
import { useRemoveBookFromBookshelf } from '@/app/api/supabase';

const AddBookButton = ({
  bookshelfId,
  googleBookId,
}: {
  bookshelfId: number;
  googleBookId: string;
}) => {
  const { mutate: removeBookFromBookshelf, isPending } =
    useRemoveBookFromBookshelf();

  const handleRemoveBook = () => {
    removeBookFromBookshelf(
      { bookshelfId, googleBookId },
      {
        onSuccess: () => {
          console.log('Book removed from bookshelf!');
        },
        onError: (error) => {
          console.error('Error removing book:', error);
        },
      },
    );
  };

  return (
    <button onClick={handleRemoveBook} disabled={isPending}>
      Remove Book from Bookshelf
    </button>
  );
};
```

---

### 7. **Fetching Books for a Bookshelf**

- **API Function**: `getBooksForBookshelf`
- **Hook**: `useBooksForBookshelf`

Retrieve all books in a specific bookshelf as Google Book objects.

```typescript
import { useBooksForBookshelf } from '@/app/api/supabase';

const BooksInBookshelf = ({ bookshelfId }: { bookshelfId: number }) => {
  const { data: books, isLoading } = useBooksForBookshelf(bookshelfId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {books?.map((book) => <li key={book.id}>{book.volumeInfo.title}</li>)}
    </ul>
  );
};
```

---

### 8. **Fetching a Single Book in Detail from Google Books API**

- **API Function**: `getBook`
- **Hook**: `useBook`

Retrieve detailed information for a specific book using its Google Book ID.

```typescript
import { useBook } from '@/app/api/books';

const BookDetails = ({ googleBookId }: { googleBookId: string }) => {
  const { data: book, isLoading } = useBook(googleBookId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {book ? (
        <>
          <h1>{book.volumeInfo.title}</h1>
          <p>{book.volumeInfo.description}</p>
        </>
      ) : (
        <p>Book not found</p>
      )}
    </>
  );
};
```

---

## Notes for Developers

- **React Query**: All hooks are built with [React Query](https://tanstack.com/query/latest/docs/react/overview) for
  data fetching and state management. Use the hooks in your components to handle API calls seamlessly.
- **Error Handling**: Make sure to handle `onError` callbacks in mutations and display user-friendly error messages.
- **Adding New APIs**: If you add new backend functionality, follow the existing file structure:
    - Add functions in the appropriate file (`bookshelves.ts`, `userBooks.ts`, etc.).
    - Export React Query hooks for the functions.
    - Update this guide with usage examples.


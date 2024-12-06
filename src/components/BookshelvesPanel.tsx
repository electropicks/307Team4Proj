'use client';

import { useState, FormEvent } from 'react';
import {
  useUserBookshelves,
  useBooksForBookshelf,
  useRemoveBookFromBookshelf,
  useCreateBookshelf,
} from '@/app/api/supabase';
import BookPopup from '@/components/popup';
import { Book } from '@/app/api/google_books/books';


interface BookToRemove {
  bookshelfId: number;
  bookshelfName: string;
  googleBookId: string;
  bookTitle: string;
}

interface BookshelvesPanelProps {
  onCloseAction: () => void;
}

export default function BookshelvesPanel({
  onCloseAction,
}: BookshelvesPanelProps) {
  const { data: bookshelves, isLoading: areBookshelvesLoading } =
    useUserBookshelves();
  const { mutate: removeBookFromBookshelf } = useRemoveBookFromBookshelf();
  const { mutate: addBookshelf } = useCreateBookshelf();

  const [bookToRemove, setBookToRemove] = useState<BookToRemove | null>(null);
  const [newShelfName, setNewShelfName] = useState('');
  const [isAddingShelf, setIsAddingShelf] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColorClass, setToastColorClass] = useState('bg-green-500');
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();

  
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  
  const handleExitPopup = () => {
    setSelectedBook(undefined);
  };

  const confirmRemove = () => {
    if (!bookToRemove) return;
    removeBookFromBookshelf(
      {
        bookshelfId: bookToRemove.bookshelfId,
        googleBookId: bookToRemove.googleBookId,
      },
      {
        onSuccess: () => {
          setBookToRemove(null);
          setToastMessage('Book successfully removed!');
          setToastColorClass('bg-green-500');
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);
        },
        onError: () => {
          setToastMessage('Failed to remove the book.');
          setToastColorClass('bg-red-500');
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3000);
        },
      },
    );
  };

  const cancelRemove = () => {
    setBookToRemove(null);
  };

  const handleShelfSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newShelfName.trim()) {
      alert('Please enter a valid bookshelf name.');
      return;
    }
    addBookshelf(newShelfName, {});
    setNewShelfName('');
    setIsAddingShelf(false);
  };

  const BooksInBookshelf = ({
    bookshelfId,
    bookshelfName,
  }: {
    bookshelfId: number;
    bookshelfName: string;
  }) => {
    const { data: books, isLoading } = useBooksForBookshelf(bookshelfId);

    if (isLoading) return <div>Loading...</div>;
    if (!books || books.length === 0) {
      return (
        <div className="text-sm text-gray-500 pl-3">No books in this shelf.</div>
      );
    }

    return (
      <ul className="list-disc pl-3">
        {books.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between space-x-2"
          >
            <button
                    onClick={() => handleBookClick(book)}
                    className="mt-1 text-sm text-foreground hover:background"
                  >
                    {book.volumeInfo.title}
                  </button>
            <button
              type="button"
              onClick={() =>
                setBookToRemove({
                  bookshelfId,
                  bookshelfName,
                  googleBookId: book.id,
                  bookTitle: book.volumeInfo.title ?? 'This Book',
                })
              }
              className="text-red-500 pl-2 hover:text-red-700 focus:outline-none"
              aria-label="Remove book"
            >
              x
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="relative h-full w-full overflow-y-auto">
      {toastVisible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg ${toastColorClass}`}
        >
          {toastMessage}
        </div>
      )}
      {/* Close Button */}
      <button
        onClick={onCloseAction}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          My Bookshelves
        </h2>

        {!isAddingShelf ? (
          <button
            onClick={() => setIsAddingShelf(true)}
            className="bg-primary text-white px-3 py-2 rounded-2xl hover:bg-primary-dark transition-colors"
          >
            + Add New Shelf
          </button>
        ) : (
          <form
            onSubmit={handleShelfSubmit}
            className="flex items-center space-x-2 mb-2"
          >
            <input
              name="shelfName"
              type="text"
              placeholder="Name your Bookshelf"
              className="rounded-2xl bg-secondary placeholder:text-accent p-2 w-full"
              value={newShelfName}
              onChange={(e) => setNewShelfName(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingShelf(false);
                setNewShelfName('');
              }}
              className="p-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </form>
        )}

        {areBookshelvesLoading ? (
          <p className="text-center text-gray-500">
            Loading your bookshelves...
          </p>
        ) : !bookshelves || bookshelves.length === 0 ? (
          <p className="text-center text-gray-500">No bookshelves found.</p>
        ) : (
          <ul className="space-y-4 pt-4">
            {bookshelves.map((bookshelf) => (

              <div className="mx-auto max-w-2xl py-3 sm:px-3 sm:py-3 lg:max-w-7xl lg:px-8 flex justify-between">
              <li
                key={bookshelf.bookshelf_id}
                className="text-gray-700 border-b pb-4"
              >
                <span className="text-2xl font-bold tracking-tight text-accent">
                  {bookshelf.bookshelf_name}
                </span>
                <div className="mt-6 flex gap-x-6 gap-y-10 overflow-hidden">
                  <BooksInBookshelf
                    bookshelfId={bookshelf.bookshelf_id}
                    bookshelfName={bookshelf.bookshelf_name}
                  />
                </div>
              </li>
              </div>
            ))}
          </ul>
        )}

        {bookToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <p className="mb-4">
                Are you sure you want to remove{' '}
                <span className="font-bold">{bookToRemove.bookTitle}</span> from{' '}
                <span className="font-bold">{bookToRemove.bookshelfName}</span>?
              </p>
              <div className="flex space-x-4 justify-end">
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove
                </button>
                <button
                  onClick={cancelRemove}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedBook && (
        <BookPopup
          selectedBookId={selectedBook.id}
          handleExitPopupAction={handleExitPopup}
        />
      )}
    </div>
  );
}

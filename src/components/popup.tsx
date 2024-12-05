'use client';

import { useBook } from '@/app/api/google_books/books';
import BookImage from '@/components/common/BookImage';
import AddToShelfPopup from '@/components/AddToShelfPopup';
import { useState } from 'react';

interface BookPopupProps {
  selectedBookId: string;
  handleExitPopupAction: () => void;
}

export default function BookPopup({
  selectedBookId,
  handleExitPopupAction,
}: BookPopupProps) {
  const { data: book, isLoading } = useBook(selectedBookId);
  const [isFormVisible, setFormVisible] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500/75">
        Loading...
      </div>
    );
  }

  if (!book) {
    console.error(`Book with id: ${selectedBookId} not found`);
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500/75">
        <div className="bg-background p-4 rounded shadow-lg">
          Book not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleExitPopupAction}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close popup"
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Book Image */}
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-72 border border-accent rounded-lg shadow-sm">
              <BookImage book={book} />
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold text-foreground">
              {book.volumeInfo.title || 'No title available'}
            </h2>

            <p className="mt-2 text-lg text-foreground">
              {book.volumeInfo.authors?.join(', ') || 'No author available'}
            </p>

            <section className="mt-4">
              <h3 className="font-semibold text-foreground">Description</h3>
              <div
                className="text-foreground max-h-72 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html:
                    book.volumeInfo.description || 'No description available.',
                }}
              />
            </section>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-foreground text-background rounded hover:bg-darkForeground focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                Mark as Unread
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-foreground rounded hover:bg-darkPrimary focus:ring-2 focus:ring-gray-300 focus:outline-none"
              >
                Edit Notes
              </button>
              <button
                onClick={() => setFormVisible((prev) => !prev)}
                type="button"
                className="px-4 py-2 bg-primary text-foreground rounded hover:bg-darkPrimary focus:ring-2 focus:ring-gray-300 focus:outline-none"
              >
                Add to Shelf
                {/*  <AddToShelfPopup/> */}
              </button>
              {isFormVisible && (
                <AddToShelfPopup handleClose={() => setFormVisible(false)} />
              )}
            </div>

            {/* User Notes */}
            <section className="mt-6">
              <h3 className="font-semibold text-foreground">My Notes</h3>
              <p className="mt-2 text-foreground">
                I want to read this book!!!
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

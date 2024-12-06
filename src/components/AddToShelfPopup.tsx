'use client';
import { useCallback, useMemo, useState } from 'react';
import { useUserBookshelves } from '@/app/api/supabase';
import { useAddBookToBookshelf } from '@/app/api/supabase';

interface AddToShelfPopupProps {
  googleBookId: string;
  handleCloseAction: () => void;
}

export default function AddToShelfPopup({
  googleBookId,
  handleCloseAction,
}: AddToShelfPopupProps) {
  const { data: bookshelves, isLoading } = useUserBookshelves();
  const [selectedBookshelfId, setSelectedBookshelfId] = useState<number | null>(
    null,
  );
  const { mutate: addBookToBookshelf, isPending } = useAddBookToBookshelf();
  const handleAddBook = useCallback(
    () =>
      selectedBookshelfId &&
      addBookToBookshelf(
        { bookshelfId: selectedBookshelfId, googleBookId },
        {
          onSuccess: () => {
            console.log('Book added to bookshelf!');
          },
        },
      ),
    [selectedBookshelfId, addBookToBookshelf, googleBookId],
  );

  const addBookButton = useMemo(
    () => (
      <button
        onClick={handleAddBook}
        disabled={isPending}
        className="mt-4 px-4 py-2 bg-primary text-foreground rounded border border-gray-300 hover:bg-primary-dark"
      >
        Add Book to Bookshelf
      </button>
    ),
    [handleAddBook, isPending],
  );

  const bookshelfList = useMemo(
    () =>
      isLoading ? (
        <div>Loading...</div>
      ) : !bookshelves ? (
        <div>No bookshelves found.</div>
      ) : (
        <ul>
          {bookshelves?.map((shelf) => (
            <li key={shelf.bookshelf_id} className="mb-2">
              <button
                onClick={() => {
                  setSelectedBookshelfId(shelf.bookshelf_id);
                }}
                className="w-full px-4 py-2 bg-secondary text-foreground rounded border border-gray-300 hover:bg-secondary-dark"
              >
                {shelf.bookshelf_name}
              </button>
            </li>
          ))}
          {selectedBookshelfId && addBookButton}
        </ul>
      ),
    [addBookButton, bookshelves, isLoading, selectedBookshelfId],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75">
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleCloseAction}
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
        <h2 className="text-2xl font-bold text-foreground sm:pr-12">
          Back to Book Details
        </h2>
        {bookshelfList}
      </div>
    </div>
  );
}

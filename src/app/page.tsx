'use client';

import { Book, useBooks } from '@/app/api/google_books/books';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import BookPopup from '@/components/popup';
import ShelfButton from '@/components/ShelfButton';
import BookImage from '@/components/common/BookImage';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [hasSearched, setHasSearched] = useState(false); // Tracks if the user has searched
  const { data: books, isLoading: isBooksLoading } = useBooks(bookSearch);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInput.trim() === '') {
      return;
    }
    setBookSearch(searchInput);
    setHasSearched(true); // Set the search flag to true after searching
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleExitPopup = () => {
    setSelectedBook(undefined);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col bg-background text-foreground items-center">
      <h1 className="bg-primary p-4 rounded-xl">Bookshelf</h1>
      <ShelfButton />
      <div className="w-full max-w-sm min-w-[200px]">
        <form onSubmit={handleSearchSubmit} className="flex p-4">
          <input
            className="bg-secondary w-full text-foreground rounded-2xl p-2 focus:outline-neutral-none placeholder:text-accent"
            placeholder="Search for books..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-primary text-foreground rounded-2xl"
          >
            <Search />
          </button>
        </form>
      </div>
      <div className="w-full mt-4 flex justify-center">
        {isBooksLoading ? (
          <p>Loading...</p>
        ) : books && books.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 xl:gap-x-8">
            {books.map((book) => (
              <div key={book.id}>
                <div className="aspect-w-3 aspect-h-4 overflow-hidden bg-gray-200">
                  <BookImage book={book} />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {book.volumeInfo.title}
                  </p>
                  {book.volumeInfo.publishedDate && (
                    <p className="text-xs text-gray-600">
                      {dayjs(book.volumeInfo.publishedDate).format(
                        'MMMM D, YYYY',
                      )}
                    </p>
                  )}
                  <button
                    onClick={() => handleBookClick(book)}
                    className="mt-2 text-sm bg-primary text-foreground rounded-lg px-3 py-1 hover:bg-primary-dark"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <p className="text-gray-500 mt-4">
              No results found. Try another search.
            </p>
          )
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

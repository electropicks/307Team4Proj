'use client';

import { Book, useBooks } from '@/app/api/google_books/books';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import BookPopup from '@/components/popup';
import BookshelvesPanel from '@/components/BookshelvesPanel';
import BookImage from '@/components/common/BookImage';
import Image from 'next/image';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [hasSearched, setHasSearched] = useState(false);
  const { data: books, isLoading: isBooksLoading } = useBooks(bookSearch);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchInput.trim() === '') {
      setHasSearched(false);
      return;
    }
    setBookSearch(searchInput);
    setHasSearched(true);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleExitPopup = () => {
    setSelectedBook(undefined);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col bg-background text-foreground w-full relative">
      <div className="w-auto flex">
        <form onSubmit={handleSearchSubmit} className="flex p-4 w-1/2">
          <input
            className="bg-secondary text-foreground rounded-2xl p-2 placeholder:text-accent w-screen my-auto focus:outline-none"
            placeholder="Search for books..."
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button
            type="submit"
            className="ml-3 mr-3 p-2 bg-primary text-foreground rounded-2xl h-10 my-auto"
          >
            <Search />
          </button>
        </form>

        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          className="ml-auto mr-3 px-2 bg-primary text-foreground rounded-2xl hover:bg-primary-dark h-10 my-auto"
        >
          <Image
            src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
            alt="Bookshelf Icon"
            width={24}
            height={24}
            loading="lazy"
          />
        </button>
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

      {showSidebar && (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white border-l border-gray-300 p-4 z-50 overflow-y-auto">
          <BookshelvesPanel onCloseAction={() => setShowSidebar(false)} />
        </div>
      )}
    </div>
  );
}

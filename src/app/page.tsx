'use client';

import { useBooks } from '@/app/api/books';
import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';

const MISSING_PLACEHOLDER_URL =
  'http://books.google.com/books/content?id=vhQ1AAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const { data: books, isLoading: isBooksLoading } = useBooks(bookSearch);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the default form submission behavior (page reload)
    if (searchInput.trim() === '') {
      return;
    }
    setBookSearch(searchInput);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col bg-background text-foreground items-center">
      <h1 className="bg-primary p-4 rounded-xl">Bookshelf</h1>
      <div className="w-full max-w-sm min-w-[200px]">
        <form onSubmit={handleFormSubmit} className="flex p-4">
          <input
            className="bg-secondary w-full text-foreground rounded-2xl p-2 focus:outline-neutral-none placeholder:text-accent"
            placeholder="Search for books..."
            value={searchInput}
            onChange={handleInputChange}
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
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
            {books.map((book) => (
              <div key={book.id} className="group relative">
                <div className="aspect-h-0.5 aspect-w-0.5 w-half overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-56">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail}
                    alt={`${book.volumeInfo.title} Thumbnail`}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {book.volumeInfo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

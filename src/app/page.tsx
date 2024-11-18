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
        ) : (
          books &&
          books.length > 0 && (
            <table className="w-full max-w-2xl mt-4 table-auto border-collapse border border-accent text-center">
              <thead>
                <tr className="bg-secondary text-foreground">
                  <th className="border border-accent p-2">Thumbnail</th>
                  <th className="border border-accent p-2">Title</th>
                  <th className="border border-accent p-2">Publish Date</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t border-accent">
                    <td className="border border-accent p-2">
                      {book.volumeInfo?.imageLinks?.thumbnail && (
                        <Image
                          src={book.volumeInfo.imageLinks?.thumbnail}
                          alt={`${book.volumeInfo.title} BookThumbnail`}
                          width={128}
                          height={206}
                          style={{ objectFit: 'contain' }}
                          loading="lazy"
                          className="max-w-full max-h-auto mx-auto rounded-lg"
                          placeholder={'blur'}
                          blurDataURL={
                            book.volumeInfo.imageLinks.smallThumbnail ||
                            MISSING_PLACEHOLDER_URL
                          }
                        />
                      )}
                    </td>
                    <td className="border border-accent p-2">
                      {book.volumeInfo.title}
                    </td>
                    <td className="border border-accent p-2 no-wrap">
                      {dayjs(book.volumeInfo.publishedDate).format(
                        'MMMM D, YYYY',
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

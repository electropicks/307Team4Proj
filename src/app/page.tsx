'use client';

import { useBooks } from '@/app/api/books';
import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import Shelf from '../components/ui/Bookshelf';

const MISSING_PLACEHOLDER_URL =
  'http://books.google.com/books/content?id=vhQ1AAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api';


const books2 = [
  {
    id: 1,
    imageSrc:
      'https://img.readthistwice.com/unsafe/696x1044/books/a339fddd-d5bd-4c41-a1d7-8a3fa8ced7a6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 2,
    imageSrc:
      'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    imageSrc:
      'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
];

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
      <div>

        <Shelf/>
        <Shelf/>
        <Shelf/>
        <Shelf/>


      </div>
    </div>
  );
}

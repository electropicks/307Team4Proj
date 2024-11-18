'use client';

import { useBooks } from '@/app/api/books';
import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';


const books1 = [
  {
    id: 1,
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 2,
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 4,
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 5,
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 6,
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 7,
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 8,
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 9,
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
]


const books2 = [
  {
    id: 1,
    imageSrc: 'https://img.readthistwice.com/unsafe/696x1044/books/a339fddd-d5bd-4c41-a1d7-8a3fa8ced7a6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 2,
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
  {
    id: 3,
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
  },
]



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
                      {book.volumeInfo.imageLinks.thumbnail && (
                        <Image
                          src={book.volumeInfo.imageLinks?.thumbnail}
                          alt={`${book.volumeInfo.title} Thumbnail`}
                          className="max-w-full h-auto mx-auto"
                          style={{ maxHeight: '200px', width: 'auto' }}
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">My TBR</h2>
          <Link href="/shelf" className="text-primary hover:text-highlight">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
              &#8680;
            </button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
          {books1.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-0.5 aspect-w-0.5 w-half overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-56">
                <img
                  alt={product.imageAlt}
                  src={product.imageSrc}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
            </div>
          ))}
          
        </div>
        
      </div>
      
      
    </div>

    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shelf 2</h2>
          <Link href="/shelf" className="text-primary hover:text-highlight">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
              &#8680;
            </button>
          </Link>
        </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
        {books2.map((product) => (
          <div key={product.id} className="group relative">
            <div className="aspect-h-0.5 aspect-w-0.5 w-half overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-56">
              <img
                alt={product.imageAlt}
                src={product.imageSrc}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </div>
  </div>
  </div>

  )
}

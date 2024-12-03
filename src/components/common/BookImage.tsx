'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { Book } from '@/app/api/books';

const MISSING_PLACEHOLDER_URL =
  'https://books.google.com/books/content?id=vhQ1AAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api';

interface BookImageProps {
  book: Book;
}

const BookImage = ({ book }: BookImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const imageLinks = book.volumeInfo.imageLinks || {};
  const imageUrl = (
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    MISSING_PLACEHOLDER_URL
  ).replace('http:', 'https:'); // Use secure HTTPS

  const customLoader = ({ src }: { src: string }) => src;

  return (
    <div className="relative w-full h-full shadow-sm overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      )}
      <Image
        src={imageUrl}
        alt={`${book.volumeInfo.title} Book Thumbnail`}
        fill
        priority
        loader={customLoader}
        className={`object-cover rounded-lg transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
};

export default BookImage;

'use client';

import Image from 'next/image';
import { Book } from '@/app/api/google_books/books';

const MISSING_PLACEHOLDER_URL = 'https://unknown.com'; // Placeholder URL for missing images

interface BookImageProps {
  book: Book;
}

const BookImage = ({ book }: BookImageProps) => {
  const imageLinks = book.volumeInfo.imageLinks || {};
  const imageUrl = (
    imageLinks.thumbnail ||
    imageLinks.smallThumbnail ||
    MISSING_PLACEHOLDER_URL
  ).replace('http:', 'https:'); // Use secure HTTPS

  const customLoader = ({
    src,
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) => {
    return `${src}&w=${width}&q=${quality || 75}`;
  };
  return (
    <div className="relative w-full h-0 pb-[150%] shadow-sm overflow-hidden">
      <Image
        src={imageUrl}
        alt={`${book.volumeInfo.title} Book Thumbnail`}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loader={customLoader}
        className={`object-cover rounded-lg transition-opacity duration-500`}
      />
    </div>
  );
};

export default BookImage;

import { useQuery } from '@tanstack/react-query';

interface Book {
  kind: 'books#volume';
  id: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: [string];
    publisher: string;
    publishedDate: string;
    description: string;
    industryIdentifiers: [
      {
        type: string;
        identifier: string;
      },
    ];
    pageCount: number;
    dimensions: {
      height: string;
      width: string;
      thickness: string;
    };
    printType: string;
    mainCategory: string;
    categories: [string];
    averageRating: number;
    ratingsCount: number;
    contentVersion: string;
    imageLinks: {
      smallThumbnail: string;
      thumbnail: string;
      small: string;
      medium: string;
      large: string;
      extraLarge: string;
    };
    language: string;
    previewLink: string;
    infoLink: string;
  };
}

export interface GetBooksResponse {
  kind: 'books#volume';
  items: Book[];
  totalItems: number;
}
const BOOKS_QUERY_KEY = 'BOOKS';

export const getBooks = async (queryString: string) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) {
    throw new Error('Google Books API key is not set');
  }

  if (!queryString) {
    return [];
  }

  const searchParams = new URLSearchParams();
  searchParams.set('q', queryString);
  searchParams.set('key', process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY);
  searchParams.set('maxResults', '15');
  searchParams.set('orderBy', 'relevance');
  searchParams.set('printType', 'books');

  const apiUrl = new URL('https://www.googleapis.com/books/v1/volumes');
  apiUrl.search = searchParams.toString();

  const response = await fetch(apiUrl);

  const json = await response.json();
  const booksResponse: GetBooksResponse = json satisfies GetBooksResponse;
  const books = booksResponse.items;
  return resolveDuplicateIds(books);
};

/**
 * Resolves duplicate IDs in the list of books by keeping the most recently published duplicate.
 * @param books
 */
const resolveDuplicateIds = (books: Book[]) => {
  const bookMap = new Map<string, Book>();
  books.forEach((book) => {
    if (!bookMap.has(book.id)) {
      bookMap.set(book.id, book);
    } else {
      const existingBook = bookMap.get(book.id);
      if (
        existingBook &&
        existingBook.volumeInfo.publishedDate < book.volumeInfo.publishedDate
      ) {
        bookMap.set(book.id, book);
      }
    }
  });
  return Array.from(bookMap.values());
};

export const useBooks = (book: string) => {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, book],
    queryFn: () => getBooks(book),
  });
};

export const usePrefetchBooks = () => {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY],
    queryFn: () => getBooks(''),
    enabled: false,
  });
};

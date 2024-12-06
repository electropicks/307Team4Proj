import { useQuery } from '@tanstack/react-query';

export interface Book {
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
const BOOKS_QUERY_KEY = 'SEARCH_BOOKS';
const SINGLE_BOOK_QUERY_KEY = 'SINGLE_BOOK_QUERY';

const searchBooks = async (queryString: string) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) {
    console.error('Google Books API key is not set');
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

export const getBook = async (bookId: string) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY) {
    console.error('Google Books API key is not set');
    throw new Error('Google Books API key is not set');
  }

  const apiUrl = new URL(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`,
  );
  apiUrl.searchParams.set('key', process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY);

  const response = await fetch(apiUrl.toString());

  if (!response.ok) {
    throw new Error(
      `Error fetching book with ID ${bookId}: ${response.statusText}`,
    );
  }

  const json = await response.json();
  const book = json satisfies Book;
  return book as Book;
};

export const useBooks = (book: string) => {
  return useQuery({
    queryKey: [BOOKS_QUERY_KEY, book],
    queryFn: () => searchBooks(book),
    enabled: !!book, // Only enable the query if there is a search query
  });
};

export const useBook = (bookId: string) => {
  return useQuery({
    queryKey: [SINGLE_BOOK_QUERY_KEY, bookId],
    queryFn: () => getBook(bookId),
    throwOnError: true,
  });
};

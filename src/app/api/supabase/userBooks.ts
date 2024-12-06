import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserId } from './utils';
import { Book, getBook } from '../google_books/books';
import { Database } from '@/utils/database.types'; // Adjust the path as needed
import { getUserBookshelves } from '@/app/api/supabase/bookshelves'; // Adjust the path as needed

export type ReadStatus = Database['public']['Enums']['ReadStatus'];

/**
 * Adds a book to a bookshelf.
 * @param {number} bookshelfId - The ID of the bookshelf.
 * @param {string} googleBookId - The Google Book ID of the book to add.
 * @returns {Promise<boolean>} True if the book was successfully added, false otherwise.
 */
export const addBookToBookshelf = async (
  bookshelfId: number,
  googleBookId: string,
): Promise<boolean | 'exists'> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookshelf_book')
      .insert([{ bookshelf_id: bookshelfId, google_book_id: googleBookId }]);

    if (error) {
      console.error('Error adding book to bookshelf:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

/**
 * Removes a book from a bookshelf.
 * @param {number} bookshelfId - The ID of the bookshelf.
 * @param {string} googleBookId - The Google Book ID of the book to remove.
 * @returns {Promise<boolean>} True if removed successfully, false otherwise.
 */
export const removeBookFromBookshelf = async (
  bookshelfId: number,
  googleBookId: string,
): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookshelf_book')
      .delete()
      .eq('bookshelf_id', bookshelfId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error removing book from bookshelf:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

/**
 * Fetches all Google Book IDs for a specific bookshelf.
 * @param {number} bookshelfId - The ID of the bookshelf.
 * @returns {Promise<string[]>} An array of Google Book IDs.
 */
export const getBookIdsForBookshelf = async (
  bookshelfId: number,
): Promise<string[]> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookshelf_book')
      .select('google_book_id')
      .eq('bookshelf_id', bookshelfId);

    if (error) {
      console.error('Error fetching books for bookshelf:', error);
      return [];
    }
    return data?.map((record) => record.google_book_id) || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

/**
 * Fetches all books for a specified bookshelf as Book objects.
 * @param {number} bookshelfId - The ID of the bookshelf.
 * @returns {Promise<Book[]>} An array of Book objects.
 */
export const getBooksForBookshelf = async (
  bookshelfId: number,
): Promise<Book[]> => {
  try {
    const googleBookIds = await getBookIdsForBookshelf(bookshelfId);

    const books = await Promise.all(
      googleBookIds.map(async (googleBookId) => {
        const bookInfo = await getBook(googleBookId);
        return bookInfo;
      }),
    );

    return books;
  } catch (error) {
    console.error('Error fetching books for bookshelf:', error);
    return [];
  }
};

/**
 * Updates the read_status for a specific book for the current user.
 * @param {string} googleBookId - The Google ID of the book.
 * @param {ReadStatus} readStatus - The new reading status of the book.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the update was successful.
 */
export const updateReadStatus = async (
  googleBookId: string,
  readStatus: ReadStatus,
): Promise<boolean> => {
  try {
    // checks if the user already has a relation to this book, if not it will create one
    const ensured = await ensureUserBookExists(googleBookId);
    if (!ensured) {
      return false; // if ensuring the row exists failed, abort the update
    }

    const supabase = createClient();
    const currentUserId = await getUserId();
    const { error } = await supabase
      .from('user_book')
      .update({ read_status: readStatus })
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error updating read status:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

/**
 * Updates the note for a specific book for the current user.
 * @param {string} googleBookId - The Google ID of the book.
 * @param {string} note - The new note for the book.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the update was successful.
 */
export const updateNote = async (
  googleBookId: string,
  note: string,
): Promise<boolean> => {
  try {
    // checks if the user already has a relation to this book, if not it will create one
    const ensured = await ensureUserBookExists(googleBookId);
    if (!ensured) {
      return false; // if ensuring the row exists failed, abort the update
    }

    const supabase = createClient();
    const currentUserId = await getUserId();
    const { error } = await supabase
      .from('user_book')
      .update({ note: note })
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error updating note:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

/**
 * Fetches read_status, rating, note, start_date, and finished_date of the current user for a specific book.
 * Returns null value in promise and logs an error to the console if non-existent.
 * @param {string} googleBookId - The Google ID of the book.
 * @returns {Promise<{
 *   read_status: string | null;
 *   rating: number | null;
 *   note: string | null;
 *   start_date: string | null;
 *   finished_date: string | null;
 * } | null>} A promise that resolves to an object containing the user's book details:
 *            Resolves to null if no details exist for the specified book.
 */
export const getUserBookDetails = async (
  googleBookId: string,
): Promise<{
  read_status: string | null;
  rating: number | null;
  note: string | null;
  start_date: string | null;
  finished_date: string | null;
} | null> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();

    const { data, error } = await supabase
      .from('user_book')
      .select('read_status, rating, note, started_date, finished_date')
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId)
      .single();

    if (error) {
      console.error('Error fetching book details:', error);
      return null;
    }

    return {
      read_status: data.read_status,
      rating: data.rating,
      note: data.note,
      start_date: data.started_date,
      finished_date: data.finished_date,
    };
  } catch (error) {
    console.error('Unexpected error in getUserBookDetails:', error);
    return null;
  }
};

/**
 * Ensures that a user_book entry exists for a specific book and user; creates one if it doesn't.
 * This is a helper function for functions which edit or add books and never needs to be called directly.
 * @param {string} googleBookId - The Google Book ID of the book.
 * @returns {Promise<boolean>} True if the entry exists or was created successfully, false otherwise.
 */
const ensureUserBookExists = async (googleBookId: string): Promise<boolean> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();

    const { error } = await supabase
      .from('user_book')
      .upsert([{ user_id: currentUserId, google_book_id: googleBookId }]);

    if (error) {
      console.error('Error ensuring user_book exists:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error in ensureUserBookExists:', error);
    return false;
  }
};

// Hooks for the functions above
/**
 * React Query hook to add a book to a bookshelf.
 * @returns Mutation object with methods to mutate the data.
 */
export const useAddBookToBookshelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['addBookToBookshelf'],
    mutationFn: ({
      bookshelfId,
      googleBookId,
    }: {
      bookshelfId: number;
      googleBookId: string;
    }) => addBookToBookshelf(bookshelfId, googleBookId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
    },
  });
};

/**
 * React Query hook to remove a book from a bookshelf.
 * @returns Mutation object with methods to mutate the data.
 */
export const useRemoveBookFromBookshelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['removeBookFromBookshelf'],
    mutationFn: ({
      bookshelfId,
      googleBookId,
    }: {
      bookshelfId: number;
      googleBookId: string;
    }) => removeBookFromBookshelf(bookshelfId, googleBookId),
    onSuccess: (data, variables) => {
      // Invalidate both the shelves and the specific shelf's books
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
      void queryClient.invalidateQueries({
        queryKey: ['getBooksForBookshelf', variables.bookshelfId],
      });
    },
  });
};

/**
 * React Query hook to fetch books for a bookshelf.
 * @param bookshelfId - The ID of the bookshelf.
 * @returns Query object with data and status.
 */
export const useBooksForBookshelf = (bookshelfId: number) => {
  return useQuery({
    queryKey: ['getBooksForBookshelf', bookshelfId],
    queryFn: () => getBooksForBookshelf(bookshelfId),
    enabled: !!bookshelfId,
  });
};

/**
 * Additional functions and hooks for updating read status, notes, etc., can be added here following the same pattern.
 */

/**
 * React Query hook to update the read status for a specific book.
 * @returns Mutation object with methods to mutate the data.
 */
export const useUpdateReadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateReadStatus'],
    mutationFn: ({
      googleBookId,
      readStatus,
    }: {
      googleBookId: string;
      readStatus: ReadStatus;
    }) => updateReadStatus(googleBookId, readStatus),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookDetails'] });
    },
  });
};

/**
 * React Query hook to update the note for a specific book.
 * @returns Mutation object with methods to mutate the data.
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateNote'],
    mutationFn: ({
      googleBookId,
      note,
    }: {
      googleBookId: string;
      note: string;
    }) => updateNote(googleBookId, note),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookDetails'] });
    },
  });
};

/**
 * React Query hook to fetch user-specific book details for a specific book.
 * @param googleBookId - The Google ID of the book.
 * @returns Query object with data and status.
 */
export const useUserBookDetails = (googleBookId: string) => {
  return useQuery({
    queryKey: ['getUserBookDetails', googleBookId],
    queryFn: () => getUserBookDetails(googleBookId),
    enabled: !!googleBookId,
  });
};

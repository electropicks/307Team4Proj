import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserId } from './utils';
import { Book, getBook } from '../google_books/books'; // Adjust the path as needed

/**
 * Adds a book to a bookshelf.
 * @param {number} bookshelfId - The ID of the bookshelf.
 * @param {string} googleBookId - The Google Book ID of the book to add.
 * @returns {Promise<boolean>} True if the book was successfully added, false otherwise.
 */
export const addBookToBookshelf = async (
  bookshelfId: number,
  googleBookId: string,
): Promise<boolean> => {
  try {
    const ensured = await ensureUserBookExists(googleBookId);
    if (!ensured) {
      return false;
    }

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
 * Ensures that a user_book entry exists for a specific book and user; creates one if it doesn't.
 * @param {string} googleBookId - The Google Book ID of the book.
 * @returns {Promise<boolean>} True if the entry exists or was created successfully, false otherwise.
 */
const ensureUserBookExists = async (googleBookId: string): Promise<boolean> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();

    // Check if this user-book entry already exists
    const { data, error } = await supabase
      .from('user_book')
      .select('user_id')
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Error other than "No rows found"
      console.error('Error checking user_book existence:', error);
      return false;
    }

    if (data) {
      // The entry exists
      return true;
    }

    // Insert the row since it doesn't exist
    const { error: insertError } = await supabase
      .from('user_book')
      .insert([{ user_id: currentUserId, google_book_id: googleBookId }]);

    if (insertError) {
      console.error('Error inserting user_book entry:', insertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error in ensureUserBookExists:', error);
    return false;
  }
};

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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
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

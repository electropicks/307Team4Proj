import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Define a type for bookshelves
export interface Bookshelf {
  bookshelf_id: number;
  bookshelf_name: string;
}

// Utility function to get the current user ID
const getUserId = async (): Promise<string> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('Error fetching user:', error);
    throw new Error('User not authenticated');
  }
  return data.user.id;
};

// Create a new bookshelf for the user
export const addBookshelf = async (
  bookshelfName: string,
): Promise<Bookshelf | null> => {
  try {
    const supabase = createClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('bookshelf')
      .insert([{ user_id: userId, bookshelf_name: bookshelfName }])
      .select('bookshelf_id, bookshelf_name')
      .single(); // To return only the inserted row

    if (error) {
      console.error('Error adding bookshelf:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

// Add a book to a bookshelf
export const addBookToBookshelf = async (
  bookshelfId: number,
  googleBookId: string,
): Promise<boolean> => {
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

// Get all bookshelves for the user
export const getUserBookshelves = async (): Promise<Bookshelf[] | null> => {
  try {
    const supabase = createClient();
    const userId = await getUserId();
    const { data, error } = await supabase
      .from('bookshelf')
      .select('bookshelf_id, bookshelf_name')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching bookshelves:', error);
      return null;
    }
    if (!data) {
      return [];
    }
    return data as Bookshelf[];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

// Get all books for a specified bookshelf
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
    return data.map((record) => record.google_book_id);
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
};

// React Query hooks for the functions
export const useAddBookshelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['addBookshelf'],
    mutationFn: addBookshelf,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
    },
  });
};

export const useAddBookToBookshelf = () =>
  useMutation({
    mutationKey: ['addBookToBookshelf'],
    mutationFn: ({ bookshelf_id, bookshelf_name }: Bookshelf) =>
      addBookToBookshelf(bookshelf_id, bookshelf_name),
  });

export const useBookshelves = () =>
  useQuery({
    queryKey: ['getUserBookshelves'],
    queryFn: getUserBookshelves,
  });

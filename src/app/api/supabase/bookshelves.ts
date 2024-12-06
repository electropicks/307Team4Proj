import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserId } from './utils';

/**
 * Represents a bookshelf belonging to a user.
 */
export interface Bookshelf {
  /** The unique identifier of the bookshelf */
  bookshelf_id: number;
  /** The name of the bookshelf */
  bookshelf_name: string;
}

/**
 * Creates a new bookshelf for the current authenticated user.
 * @param {string} bookshelfName - The name of the bookshelf to create.
 * @returns {Promise<Bookshelf | null>} The created Bookshelf object or null if an error occurs.
 */
export const createBookshelf = async (
  bookshelfName: string,
): Promise<Bookshelf | null> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();
    const { data, error } = await supabase
      .from('bookshelf')
      .insert([{ user_id: currentUserId, bookshelf_name: bookshelfName }])
      .select('bookshelf_id, bookshelf_name')
      .single(); // To return only the inserted row

    if (error) {
      console.error('Error adding bookshelf:', error);
      return null;
    }
    return data as Bookshelf;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

/**
 * Fetches all bookshelves for the current authenticated user.
 * @returns {Promise<Bookshelf[] | null>} An array of Bookshelf objects or null if an error occurs.
 */
export const getUserBookshelves = async (): Promise<Bookshelf[] | null> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();
    const { data, error } = await supabase
      .from('bookshelf')
      .select('bookshelf_id, bookshelf_name')
      .eq('user_id', currentUserId);

    if (error) {
      console.error('Error fetching bookshelves:', error);
      return null;
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

/**
 * Deletes a bookshelf by ID.
 * @param {number} bookshelfId - The ID of the bookshelf to delete.
 * @returns {Promise<boolean>} True if deleted successfully, false otherwise.
 */
export const deleteBookshelf = async (
  bookshelfId: number,
): Promise<boolean> => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookshelf')
      .delete()
      .eq('bookshelf_id', bookshelfId);

    if (error) {
      console.error('Error deleting bookshelf:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

/**
 * Updates the name of a bookshelf.
 * @param {number} bookshelfId - The ID of the bookshelf to update.
 * @param {string} newBookshelfName - The new name for the bookshelf.
 * @returns {Promise<Bookshelf | null>} The updated Bookshelf object or null if an error occurs.
 */
export const updateBookshelfName = async (
  bookshelfId: number,
  newBookshelfName: string,
): Promise<Bookshelf | null> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookshelf')
      .update({ bookshelf_name: newBookshelfName })
      .eq('bookshelf_id', bookshelfId)
      .select('bookshelf_id, bookshelf_name')
      .single();

    if (error) {
      console.error('Error updating bookshelf name:', error);
      return null;
    }
    return data as Bookshelf;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

// Hooks for the functions above

/**
 * React Query hook to create a new bookshelf.
 * @returns Mutation object with methods to mutate the data.
 */
export const useCreateBookshelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['createBookshelf'],
    mutationFn: createBookshelf,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
    },
  });
};

/**
 * React Query hook to fetch all user bookshelves.
 * @returns Query object with data and status.
 */
export const useUserBookshelves = () => {
  return useQuery({
    queryKey: ['getUserBookshelves'],
    queryFn: getUserBookshelves,
  });
};

/**
 * React Query hook to delete a bookshelf.
 * @returns Mutation object with methods to mutate the data.
 */
export const useDeleteBookshelf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteBookshelf'],
    mutationFn: deleteBookshelf,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
    },
  });
};

/**
 * React Query hook to update a bookshelf name.
 * @returns Mutation object with methods to mutate the data.
 */
export const useUpdateBookshelfName = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['updateBookshelfName'],
    mutationFn: ({
      bookshelfId,
      newBookshelfName,
    }: {
      bookshelfId: number;
      newBookshelfName: string;
    }) => updateBookshelfName(bookshelfId, newBookshelfName),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['getUserBookshelves'] });
    },
  });
};

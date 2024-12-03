import { createClient } from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Database } from '@/utils/database.types';

type ReadStatus = Database['public']['Enums']['ReadStatus'];

// utility function to get the current user ID
const getUserId = async (): Promise<string> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('Error fetching user:', error);
    throw new Error('User not authenticated');
  }
  return data.user.id;
};

// define a type for bookshelves
export interface Bookshelf {
  bookshelf_id: number;
  bookshelf_name: string;
}

// get all bookshelves for the current user
// all bookshelves belonging to user returned as array within a promise
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
    if (!data) {
      return [];
    }
    return data as Bookshelf[];
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

// get all books of a specific bookshelf
// returns a promise with an array of string Google Book IDs
// empty array if shelf is empty or does not exist
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

// create a new bookshelf for the current user
// bookshelf created is returned as a promise
// duplicate bookshelf name - user pairs will safely output error to the console
export const addBookshelf = async (
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

// delete an entire bookshelf
// returns true if deleted or non-existent, false otherwise
// also cascade deletes any records from other tables which reference the bookshelf being deleted
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

// update the name of a bookshelf
// returns a Bookshelf object with the updated name within a promise
// return value in promise is null if bookshelf does not exist and safely outputs error to the console
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

// add a book to a bookshelf
// returns true if book successfully added false if not
// duplicate book adding will safely output error to the console
export const addBookToBookshelf = async (
  bookshelfId: number,
  googleBookId: string,
): Promise<boolean> => {
  try {
    // checks if the user already has a relation to this book, if not it will create one
    const ensured = await ensureUserBookExists(googleBookId);
    if (!ensured) {
      return false; // if ensuring the row exists failed, abort the update
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

// remove a book from a bookshelf
// returns true if removed or non-existent in bookshelf, false otherwise
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

// update read_status for a specific book for the current user
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

// update note for a specific book for the current user
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

// update rating for a specific book for the current user
export const updateRating = async (
  googleBookId: string,
  rating: number,
): Promise<boolean> => {
  try {
    // ensure the rating is within the allowed range
    if (rating < 1 || rating > 5) {
      console.error('Invalid rating. Must be between 1 and 5.');
      return false;
    }

    // checks if the user already has a relation to this book, if not it will create one
    const ensured = await ensureUserBookExists(googleBookId);
    if (!ensured) {
      return false; // if ensuring the row exists failed, abort the update
    }

    const supabase = createClient();
    const currentUserId = await getUserId();
    const { error } = await supabase
      .from('user_book')
      .update({ rating: rating })
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error updating rating:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error in updateRating:', error);
    return false;
  }
};

// update started_date for a specific book for the current user
// will not perform update and output a console error message if not in 'YYYY-MM-DD' format
export const updateStartDate = async (
  googleBookId: string,
  startDate: string, // expected in 'YYYY-MM-DD' format
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
      .update({ started_date: startDate })
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error updating start date:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error in updateStartDate:', error);
    return false;
  }
};

// update finished_date for a specific book for the current user
// will not perform update and output a console error message if not in 'YYYY-MM-DD' format
export const updateFinishedDate = async (
  googleBookId: string,
  finishedDate: string, // expected in 'YYYY-MM-DD' format
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
      .update({ finished_date: finishedDate })
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId);

    if (error) {
      console.error('Error updating finished date:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Unexpected error in updateFinishedDate:', error);
    return false;
  }
};

// fetch read_status, rating, note, start_date and finished_date for a specific book for the current user
// returns null value in promise and error to console if non-existent
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

// ensure a user_book entry exists for book being interacted with or create it
// this function is a helper for other functions and need not be called directly
export const ensureUserBookExists = async (
  googleBookId: string,
): Promise<boolean> => {
  try {
    const supabase = createClient();
    const currentUserId = await getUserId();

    // check if this user-book entry already exists
    const { data: existingEntry, error: selectError } = await supabase
      .from('user_book')
      .select('user_id, google_book_id')
      .eq('user_id', currentUserId)
      .eq('google_book_id', googleBookId)
      .single();

    if (selectError) {
      console.error(
        'Error checking user_book existence:',
        selectError.message,
        selectError.details,
      );
      return false;
    }

    if (existingEntry) {
      // the entry exists, can exit with true response
      return true;
    }

    // otherwise insert the row since it doesn't exist
    const { error: insertError } = await supabase
      .from('user_book')
      .insert([{ user_id: currentUserId, google_book_id: googleBookId }]);

    if (insertError) {
      console.error('Error inserting user_book entry:', insertError);
      return false;
    }

    return true; // return true if successfully added to user_book table
  } catch (error) {
    console.error('Unexpected error in ensureUserBookExists:', error);
    return false;
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

// React Query hooks for the new functions (Milad wrote)

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
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
    },
  });
};

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
      // Invalidate related queries to refresh data
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
    },
    onError: (error) => {
      console.error('Error updating note:', error);
    },
  });
};

export const useUpdateRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateRating'],
    mutationFn: ({
      googleBookId,
      rating,
    }: {
      googleBookId: string;
      rating: number;
    }) => updateRating(googleBookId, rating),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      void queryClient.invalidateQueries({ queryKey: ['userBooks'] });
    },
    onError: (error) => {
      console.error('Error updating rating:', error);
    },
  });
};

// // error on the hooks below
// export const useUserBookDetails = (googleBookId: string) => {
//   return useQuery({
//     queryKey: ['bookDetails', googleBookId],
//     queryFn: () => getUserBookDetails(googleBookId),
//     enabled: !!googleBookId, // Prevent the query from running if googleBookId is not provided
//     onError: (error) => {
//       console.error('Error fetching book details:', error);
//     },
//   });
// };

// export const useUpdateStartDate = () => {
//   return useMutation({
//     mutationKey: ['updateStartDate'],
//     mutationFn: updateStartDate,
//   });
// };

// export const useUpdateFinishedDate = () => {
//   return useMutation({
//     mutationKey: ['updateFinishedDate'],
//     mutationFn: updateFinishedDate,
//   });
// };

// need help on this function, want to return the books retrieved from database as Google IDs as Book objects with book info

// // get all books for a specified bookshelf as book objects
// export const getBookObjectsForBookshelf = async (
//   bookshelfId: number,
// ): Promise<Book[]> => {
//   try {
//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from('bookshelf_book')
//       .select('google_book_id')
//       .eq('bookshelf_id', bookshelfId);

//     if (error) {
//       console.error('Error fetching books for bookshelf:', error);
//       return [];
//     }

//     return data.map((record) => useBook(record.google_book_id).data);
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return [];
//   }
// };

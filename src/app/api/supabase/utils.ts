import { createClient } from '@/utils/supabase/client';

/**
 * Utility function to get the current authenticated user's ID.
 * @returns {Promise<string>} The user's ID.
 * @throws Will throw an error if the user is not authenticated.
 */
export const getUserId = async (): Promise<string> => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error('Error fetching user:', error);
    throw new Error('User not authenticated');
  }
  return data.user.id;
};

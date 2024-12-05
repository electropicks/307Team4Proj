'use client';
import { useCallback, useState } from 'react';
import { useUserBookshelves } from '@/app/api/supabase';
import { useAddBookToBookshelf } from '@/app/api/supabase';

interface AddToShelfPopupProps {
  googleBookId: string;
  handleClose: () => void;
}

/*getting user bookshleves to display on add popup */
const BookshelvesList = ({ googleBookId }: { googleBookId: string }) => {
  const { data: bookshelves, isLoading } = useUserBookshelves();
  const [selectedBookshelfId, setSelectedBookshelfId] = useState<number | null>(
    null,
  );
  const { mutate: addBookToBookshelf, isPending } = useAddBookToBookshelf();
  const handleAddBook = useCallback(
    () =>
      selectedBookshelfId &&
      addBookToBookshelf(
        { bookshelfId: selectedBookshelfId, googleBookId },
        {
          onSuccess: () => {
            console.log('Book added to bookshelf!');
          },
        },
      ),
    [selectedBookshelfId, addBookToBookshelf, googleBookId],
  );

  const addBookButton = (
    <button onClick={handleAddBook} disabled={isPending}>
      Add Book to Bookshelf
    </button>
  );

  if (isLoading) return <div>Loading...</div>;
  return (
    <ul>
      {bookshelves?.map((shelf) => (
        <li key={shelf.bookshelf_id}>
          <button
            onClick={() => {
              setSelectedBookshelfId(shelf.bookshelf_id);
            }}
            className="text-2xl text-foreground"
          >
            {shelf.bookshelf_name}
          </button>
        </li>
      ))}
      {/*the add book button only renders if a bookshelf has been clicked */}
      {selectedBookshelfId && addBookButton}
    </ul>
  );
};

export default function Home({
  googleBookId,
  handleClose,
}: AddToShelfPopupProps) {
  return (
    <div>
      <div className="relative z-10" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 hidden bg-gray-500/75 transition-opacity md:block"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-1/2 items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <div className="flex w-1/2 transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
              <div className="relative flex w-full items-center overflow-hidden bg-background px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-1 lg:gap-x-8">
                  <div className="sm:col-span-4 lg:col-span-5 gap-y-8">
                    <button
                      onClick={handleClose}
                      className="bg-primary hover:bg-darkPrimary text-background py-2 px-4 rounded-full"
                    >
                      &#8678;
                    </button>

                    <h2 className="text-2xl font-bold text-foreground sm:pr-12">
                      Back to Book Details
                    </h2>
                    <BookshelvesList googleBookId={googleBookId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

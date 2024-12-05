'use client';
import { useState } from 'react';
import Form from 'next/form';
import { useCreateBookshelf, useUserBookshelves } from '@/app/api/supabase';
import { useBooksForBookshelf } from '@/app/api/supabase';
import Image from 'next/image';

export default function ShelfButton() {
  const [isFormVisible, setFormVisible] = useState<boolean>(false);

  const { mutate: addBookshelf } = useCreateBookshelf();
  const [isButtonVisible, setButtonVisible] = useState<boolean>(true);
  const { data: bookshelves, isLoading: areBookshelvesLoading } =
    useUserBookshelves();

  const BooksInBookshelf = ({ bookshelfId }: { bookshelfId: number }) => {
    const { data: books, isLoading } = useBooksForBookshelf(bookshelfId);

    if (isLoading) return <div>Loading...</div>;

    return (
      <ul>
        {books?.map((book) => <li key={book.id}>{book.volumeInfo.title}</li>)}
      </ul>
    );
  };

  async function handleShelfSubmit(formData: FormData) {
    const newBookshelfName = formData.get('shelfName') as string;
    if (!newBookshelfName.trim()) {
      alert('Please enter a valid bookshelf name.');
      return;
    }
    addBookshelf(newBookshelfName, {});
    setButtonVisible(true);
    setFormVisible(false);
  }

  return (
    <div className="flex mr-5 ml-auto">
      {isButtonVisible && (
        <button
          onClick={() => {
            setFormVisible((prev) => !prev);
            setButtonVisible((prev) => !prev);
          }}
          className="bg-primary p-1 rounded-xl w-14 h-10 m-auto flex"
        >
          <Image
            src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
            alt="search button"
            width={30}
            height={30}
          />
          <p className="text-xl">+</p>
        </button>
      )}
      {isFormVisible && (
        <Form action={handleShelfSubmit} className=" rounded-lg flex m-auto">
          <label
            htmlFor="shelfName"
            className="block text-lg text-gray-700 mb-2"
          ></label>
          <input
            id="shelfName"
            name="shelfName"
            type="text"
            placeholder="Name your Bookshelf"
            className="rounded-2xl bg-secondary placeholder:text-accent w-96 p-2"
          />
          <button
            type="submit"
            className="mt-4 p-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Submit
          </button>
        </Form>
      )}

      <div className="mt-6">
        {areBookshelvesLoading ? (
          <p className="text-center text-gray-500">
            Loading your bookshelves...
          </p>
        ) : bookshelves?.length ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Your Bookshelves:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              {bookshelves.map((bookshelf) => (
                <li key={bookshelf.bookshelf_id} className="text-gray-700">
                  <span className="font-bold text-blue-600">
                    {bookshelf.bookshelf_name}
                  </span>
                  <div>
                    <BooksInBookshelf bookshelfId={bookshelf.bookshelf_id} />
                    {/* Close Button */}
                    <button
                      type="button"
                      /* onClick={handleExitPopupAction} */
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      aria-label="Delete shelf"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-500">No bookshelves found.</p>
        )}
      </div>
    </div>
  );
}

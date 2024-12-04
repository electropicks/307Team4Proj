'use client';
import { useState } from 'react';
import Form from 'next/form';
import { useCreateBookshelf, useUserBookshelves } from '@/app/api/supabase';

export default function ShelfButton() {
  const [isFormVisible, setFormVisible] = useState<boolean>(false);

  const { mutate: addBookshelf } = useCreateBookshelf();
  const { data: bookshelves, isLoading: areBookshelvesLoading } =
    useUserBookshelves();

  async function handleShelfSubmit(formData: FormData) {
    const newBookshelfName = formData.get('shelfName') as string;
    if (!newBookshelfName.trim()) {
      alert('Please enter a valid bookshelf name.');
      return;
    }
    addBookshelf(newBookshelfName, {});
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <button
        onClick={() => setFormVisible((prev) => !prev)}
        className="bg-primary text-white p-4 rounded-xl hover:bg-primary-dark transition-colors"
      >
        {isFormVisible ? 'Cancel' : 'Create a new Bookshelf'}
      </button>

      {isFormVisible && (
        <Form
          action={handleShelfSubmit}
          className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md"
        >
          <label
            htmlFor="shelfName"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Name Your Bookshelf
          </label>
          <input
            id="shelfName"
            name="shelfName"
            type="text"
            placeholder="My TBR"
            className="py-2 px-4 border border-gray-300"
            placeholder="e.g., Fun Reading"
            className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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

'use client';
import { useState } from 'react';
import Form from 'next/form';
import { useCreateBookshelf } from '@/app/api/supabase';
import Image from 'next/image';

export default function ShelfButton() {
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(true);
  const { mutate: addBookshelf } = useCreateBookshelf();

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
            alt="add bookshelf button"
            width={30}
            height={30}
          />
          <p className="text-xl">+</p>
        </button>
      )}
      {isFormVisible && (
        <Form action={handleShelfSubmit} className="rounded-lg flex m-auto">
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
    </div>
  );
}

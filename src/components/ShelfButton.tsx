'use client';
import { useState } from 'react';
import Form from 'next/form';
import Image from 'next/image';

export default function ShelfButton() {
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean>(true);
  const [bookshelves, setBookshelves] = useState<string[]>([]);

  async function handleShelfSubmit(formData: FormData) {
    const input = formData.get('shelfName') as string;
    setBookshelves((prevBookshelves) => [...prevBookshelves, input]);
    setFormVisible(false);
    setButtonVisible(true);
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
            className="ml-2 p-2 bg-primary text-foreground rounded-2xl"
          >
            Submit
          </button>
        </Form>
      )}
      <div className="mt-6">
        {bookshelves.length > 0 && (
          <div className="text-xl font-semibold text-gray-800">
            <h3 className="text-left">Your Bookshelves:</h3>
            <ul className="list-disc pl-5 mt-3">
              {bookshelves.map((name, index) => (
                <li key={index} className="text-left">
                  <p className="font-bold text-blue-600">{name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

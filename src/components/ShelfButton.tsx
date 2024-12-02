'use client';
import { useState } from 'react';
import Form from 'next/form';

export default function ShelfButton() {
  const [isFormVisible, setFormVisible] = useState<boolean>(false);
  const [bookshelves, setBookshelves] = useState<string[]>([]);

  async function handleShelfSubmit(formData: FormData) {
    const input = formData.get('shelfName') as string;
    setBookshelves((prevBookshelves) => [...prevBookshelves, input]);
    setFormVisible(false);
  }
  return (
    <div>
      <button
        onClick={() => setFormVisible((prev) => !prev)}
        className="bg-primary p-4 rounded-xl"
      >
        Create a new Bookshelf
      </button>
      {isFormVisible && (
        <Form action={handleShelfSubmit} className="mt-6 rounded-lg">
          <label
            htmlFor="shelfName"
            className="block text-lg text-gray-700 mb-2"
          >
            Name Your Bookshelf
          </label>
          <input
            id="shelfName"
            name="shelfName"
            type="text"
            placeholder="My TBR"
            className="py-2 px-4 border border-gray-300"
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

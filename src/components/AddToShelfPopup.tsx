'use client';
import Link from 'next/link';

export default function Home() {
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
                <button
                  type="button"
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-1 lg:gap-x-8">
                  <div className="sm:col-span-4 lg:col-span-5 gap-y-8">
                    <Link
                      href="/popup"
                      className="text-primary hover:text-highlight"
                    >
                      <button className="bg-primary hover:bg-blue-700 text-white py-2 px-4 rounded-full">
                        &#8678;
                      </button>
                      <h2 className="text-2xl font-bold text-foreground sm:pr-12">
                        Back to Book Details
                      </h2>
                    </Link>

                    <div className="mt-2 flex gap-x-6">
                      <img
                        className="size-10"
                        src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
                      />
                      <p className="text-2xl text-foreground">To Be Read</p>
                    </div>

                    <div className="mt-2 flex gap-x-6">
                      <img
                        className="size-10"
                        src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
                      />
                      <p className="text-2xl text-foreground">Classics</p>
                    </div>

                    <div className="mt-2 flex gap-x-6">
                      <img
                        className="size-10"
                        src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
                      />
                      <p className="text-2xl text-foreground">Mystery</p>
                    </div>

                    <div className="mt-2 flex gap-x-6">
                      <img
                        className="size-10"
                        src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3207857/bookshelf-icon-md.png"
                      />
                      <p className="text-2xl text-foreground">Fall Reads</p>
                    </div>
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

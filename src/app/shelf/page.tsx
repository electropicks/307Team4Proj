'use client';
import Books from '../../components/ui/book-data';
import Link from 'next/link';

export default function Bookshelf() {
  return (
    <div>
      <div className="bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <Link href="/" className="text-primary hover:text-highlight">
            <button className="bg-primary hover:bg-darkPrimary text-accent py-2 px-4 rounded-full">
              &#8678;
            </button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-accent">
            My TBR
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
            {Books().map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-0.5 aspect-w-0.5 w-half overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-56">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import Link from 'next/link';


/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Mom',
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Grandma',
  },
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Mom',
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Grandma',
  },
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9780861542109/iron-widow-9780861542109_hr.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Mom',
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Grandma',
  },
]


const products2 = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://img.readthistwice.com/unsafe/696x1044/books/a339fddd-d5bd-4c41-a1d7-8a3fa8ced7a6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
  {
    id: 2,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/05/78/1a/05781a16b09694baa3aedf6aa9a9f9d7.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Mom',
  },
  {
    id: 3,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://i.pinimg.com/originals/4e/db/dd/4edbdd1bde987a0f10ce496b16332df6.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Your Grandma',
  },
]



export default function Home() {
  return (
    <div>
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">My TBR</h2>
          <Link href="/shelf" className="text-primary hover:text-highlight">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
              &#8680;
            </button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
          {products.map((product) => (
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

    <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shelf 2</h2>
          <Link href="/shelf" className="text-primary hover:text-highlight">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
              &#8680;
            </button>
          </Link>
        </div>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-7 xl:gap-x-8">
        {products2.map((product) => (
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
  )
}

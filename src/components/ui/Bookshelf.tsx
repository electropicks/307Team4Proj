import Link from "next/link";
import Books from "./book-data";
  

export default function Shelf() {
    return <div className="bg-white">
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          My TBR
        </h2>
        <Link href="/shelf" className="text-primary hover:text-highlight">
          <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full">
            &#8680;
          </button>
        </Link>
      </div>

      <div className="mt-6 flex gap-x-6 gap-y-10 overflow-hidden">
        {Books().map((product) => (
          <div key={product.id} className="group relative">
            <div className="w-32 h-full flex-none rounded-md bg-gray-200 group-hover:opacity-75">
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
}
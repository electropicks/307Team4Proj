import Link from 'next/link';
import NavLink from '@/app/NavLink';
import Feature from '@/app/Feature';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="flex items-center justify-between p-6 bg-secondary shadow-md">
        <div className="text-2xl font-bold text-accent">GreatReads</div>
        <div>
          <NavLink href="/login">Log In</NavLink>
          <NavLink href="/signup">Sign Up</NavLink>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold mb-6">
          Welcome to <span className="text-primary">GreatReads</span>
        </h1>
        <p className="text-lg mb-8 max-w-2xl">
          For readers who want an intuitive way to organize their reading,
          GreatReads is a reading tracking app that offers a user-friendly way
          to organize and track books you have read or want to read.
        </p>
        <Link href="/signup" className="text-primary hover:text-highlight">
          Get Started
        </Link>
      </main>

      <section className="py-12 bg-highlight">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Feature
              icon="📚"
              title="Bookshelves"
              description="Create personalized bookshelves to organize your reading."
            />
            <Feature
              icon="🔖"
              title="Track Reading Progress"
              description="Mark books as read or unread to keep track of your plans."
            />
            <Feature
              icon="✍️"
              title="Personal Notes"
              description="Add notes to any book to capture your thoughts."
            />
            <Feature
              icon="🔍"
              title="Search Books"
              description="Expand your reading interests by searching for new books."
            />
          </div>
        </div>
      </section>

      <footer className="bg-secondary py-6">
        <div className="text-center text-foreground">
          &copy; {new Date().getFullYear()} GreatReads. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

import Link from 'next/link';

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="text-foreground hover:text-primary mx-4">
    {children}
  </Link>
);

export default NavLink;

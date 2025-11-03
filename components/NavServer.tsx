import Link from "next/link";
import NavClient from "./NavClient";

const categories = [
  "Mens",
  "Womens",
  "Kids",
  "Electronic Items",
  "Kitchen Accessories",
  "News & Blogs",
  "Contact Us",
];

// Server Component - renders static navigation structure
export default function NavServer() {
  return (
    <header className="w-full border-b shadow-sm relative">
      {/* Top bar (desktop only) */}
      <div className="hidden md:flex justify-between items-center px-4 py-2 text-sm bg-gray-50">
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-gray-600 hover:text-amber-500 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-amber-500 transition-colors"
          >
            Order Tracking
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-amber-500 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="#"
            className="text-gray-600 hover:text-amber-500 transition-colors"
          >
            FAQs
          </Link>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://example.com/my-account"
            className="cursor-pointer text-gray-600 hover:text-amber-500 transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/my-orders"
            className="cursor-pointer text-gray-600 hover:text-amber-500 transition-colors"
          >
            Orders
          </Link>
        </div>
      </div>

      {/* Desktop bottom nav */}
      <nav className="hidden md:flex justify-center gap-8 py-3 bg-gray-50 font-medium">
        {categories.map((item) => (
          <Link
            key={item}
            href="#"
            className="relative text-gray-700 hover:text-amber-500 transition-colors after:block after:h-[2px] after:w-0 after:bg-amber-500 after:transition-all hover:after:w-full after:mx-auto"
          >
            {item}
          </Link>
        ))}
      </nav>

      {/* Client Component for interactive elements */}
      <NavClient categories={categories} />
    </header>
  );
}
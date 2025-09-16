"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiPhone,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Mens",
    "Womens",
    "Kids",
    "Electronic Items",
    "Kitchen Accessories",
    "News & Blogs",
    "Contact Us",
  ];

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
            href="https://example.com/orders"
            className="cursor-pointer text-gray-600 hover:text-amber-500 transition-colors"
          >
            Orders
          </Link>
        </div>
      </div>

      {/* Middle bar */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-amber-500">E-Shop</div>

        {/* Desktop search bar */}
        <div className="hidden md:flex flex-1 max-w-3xl mx-auto">
          <div className="flex w-full">
            <input
              type="text"
              placeholder="I'm shopping for..."
              className="flex-1 border px-4 py-2 text-sm rounded-l-lg focus:outline-none"
            />
            <button className="bg-amber-500 text-white px-4 rounded-r-lg hover:bg-amber-600 transition-colors flex items-center justify-center">
              <FiSearch className="text-white text-lg" />
            </button>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-gray-600">
            <FiPhone className="text-amber-500" />
            <div className="text-sm">
              <p className="font-medium">Need Help?</p>
              <p className="text-gray-500">+001 123 456 789</p>
            </div>
          </div>

          <Link
            href="#"
            className="text-gray-700 hover:text-amber-500 transition-colors text-xl"
          >
            <FiUser />
          </Link>
          <Link
            href="#"
            className="text-gray-700 hover:text-amber-500 transition-colors text-xl"
          >
            <FiHeart />
          </Link>
          <Link
            href="#"
            className="relative text-gray-700 hover:text-amber-500 transition-colors text-xl"
          >
            <FiShoppingCart />
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-1 rounded-full">
              1
            </span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-800 text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex w-full">
          <input
            type="text"
            placeholder="I'm shopping for..."
            className="flex-1 border px-4 py-2 text-sm rounded-l-lg focus:outline-none"
          />
          <button className="bg-amber-500 text-white px-4 rounded-r-lg hover:bg-amber-600 transition-colors flex items-center justify-center">
            <FiSearch className="text-white text-lg" />
          </button>
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

      {/* Mobile slide-in menu */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 bg-white shadow-md transform transition-transform duration-300 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col mt-16 px-4">
          {categories.map((item) => (
            <Link
              key={item}
              href="#"
              className="block py-3 text-gray-700 hover:text-amber-500 text-lg font-medium transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

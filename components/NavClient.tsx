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

interface NavClientProps {
  categories: string[];
}

export default function NavClient({ categories }: NavClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Middle bar */}
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold text-amber-500">E-Shop</div>
        </Link>

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
            href="/profile"
            className="text-gray-700 hover:text-amber-500 transition-colors text-xl"
          >
            <FiUser />
          </Link>
          <Link
            href="/my-wishlist"
            className="text-gray-700 hover:text-amber-500 transition-colors text-xl"
          >
            <FiHeart />
          </Link>
          <Link
            href="/cart"
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
    </>
  );
}
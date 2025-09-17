import NewsLetter from "./NewsLetter";
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-amber-500 mb-4">E-Shop</h2>
          <p className="text-gray-400 text-sm">
            E-Shop is your one-stop online store for electronics, fashion, and
            home essentials. Quality products at the best prices.
          </p>
          <div className="flex gap-4 mt-4">
            <FiFacebook className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
            <FiInstagram className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
            <FiTwitter className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
            <FiYoutube className="w-6 h-6 hover:text-amber-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-amber-500 cursor-pointer">About Us</li>
            <li className="hover:text-amber-500 cursor-pointer">Shop</li>
            <li className="hover:text-amber-500 cursor-pointer">FAQs</li>
            <li className="hover:text-amber-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-amber-500 cursor-pointer">Blog</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-amber-500 cursor-pointer">
              Shipping Policy
            </li>
            <li className="hover:text-amber-500 cursor-pointer">
              Return Policy
            </li>
            <li className="hover:text-amber-500 cursor-pointer">
              Payment Options
            </li>
            <li className="hover:text-amber-500 cursor-pointer">Track Order</li>
            <li className="hover:text-amber-500 cursor-pointer">Support</li>
          </ul>
        </div>

        {/* Newsletter */}
        <NewsLetter></NewsLetter>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </footer>
  );
}

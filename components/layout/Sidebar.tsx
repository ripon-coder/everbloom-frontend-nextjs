"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiCreditCard,
  FiMessageCircle,
  FiHome,
  FiLock,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Detect current route
  const [isOpen, setIsOpen] = useState(false);

  const menuSections = [
    {
      title: "Account",
      items: [
        { name: "Profile", icon: <FiUser />, url: "/profile" },
        { name: "Address Book", icon: <FiHome />, url: "/address-book" },
        { name: "Change Password", icon: <FiLock />, url: "/change-password" },
        { name: "Settings", icon: <FiSettings />, url: "/settings" },
      ],
    },
    {
      title: "Orders",
      items: [
        { name: "My Orders", icon: <FiShoppingBag />, url: "/my-orders" },
        { name: "Payment Methods", icon: <FiCreditCard />, url: "/payment-methods" },
      ],
    },
    {
      title: "Wishlist",
      items: [{ name: "My Wishlist", icon: <FiHeart />, url: "/my-wishlist" }],
    },
    {
      title: "Support",
      items: [{ name: "Messages", icon: <FiMessageCircle />, url: "/messages" }],
    },
  ];

  const handleMenuClick = (url: string) => {
    router.push(url);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();

      if (data.status) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 bg-white border-b flex items-center justify-between cursor-pointer"
      >
        <h1 className="font-bold text-md text-amber-600 mx-auto">User Panel</h1>
        <button aria-label="Toggle user sidebar">
          {isOpen ? (
            <FiChevronUp className="text-amber-600" size={24} />
          ) : (
            <FiChevronDown className="text-amber-600" size={24} />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white shadow-xl
          w-64 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        <div className="flex flex-col p-4 h-full justify-between">
          <nav className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.url; // ✅ Active check
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => handleMenuClick(item.url)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-500 transition ${
                            isActive ? "bg-amber-50 text-amber-600 font-medium" : ""
                          }`}
                        >
                          {item.icon} {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 border border-red-500 cursor-pointer hover:bg-red-50 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

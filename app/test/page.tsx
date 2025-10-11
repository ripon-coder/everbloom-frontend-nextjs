"use client";
import React, { useEffect } from "react";

export default function Page() {
  const [mounted, setMounted] = React.useState({id: null as number | null});
  const menus = [
    {
      id: 1,
      name: "Home",
      children: [],
    },
    {
      id: 2,
      name: "About Us",
      children: [],
    },
    {
      id: 3,
      name: "Category",
      children: [
        { id: 10, name: "Subcategory 1" },
        { id: 20, name: "Subcategory 2" },
        { id: 30, name: "Subcategory 3" },
      ],
    },
    {
      id: 4,
      name: "Portfolio",
      children: [
        { id: 40, name: "Web Design" },
        { id: 50, name: "Graphic Design" },
        { id: 60, name: "Photography" },
      ],
    },
    {
      id: 5,
      name: "Contact",
      children: [],
    },
  ];

  const expandCollapse = (id: number) => {
    setMounted((prev) => ({ id: prev.id === id ? null : id }));
  };
  

  return (
    <div className="p-10">
      <ul>
        {menus.map((menu) => (
          <li
            key={menu.id}
            onClick={() => expandCollapse(menu.id)}
            className="cursor-pointer"
          >
            {menu.name}
            {menu.children.length > 0 && mounted.id == menu.id && (
              <ul className="ml-5">
                {menu.children.map((child) => (
                  <li key={child.id}>{child.name}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

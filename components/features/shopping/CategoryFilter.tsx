import Image from "next/image";
import category from "@/public/category.jpeg";
import category1 from "@/public/category1.jpeg";

export default function Categories() {
  const categories = [
    { id: 1, img: category, name: "Fruit" },
    { id: 2, img: category, name: "Vegetables" },
    { id: 3, img: category, name: "Snacks" },
    { id: 4, img: category, name: "Fruit & Drinks & Vege" },
    { id: 5, img: category1, name: "Beverages" },
    { id: 6, img: category1, name: "Dairy" },
    { id: 7, img: category, name: "Frozen Foods" },
  ];

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Shop by Categories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white shadow-sm hover:shadow-md 
                       hover:-translate-y-1 transition duration-300 cursor-pointer"
          >
            <div className="relative w-full h-20 sm:h-24 md:h-28  overflow-hidden">
              <Image
                src={c.img}
                alt={c.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <h1 className="text-center text-xs sm:text-sm font-medium text-gray-700 truncate">
                {c.name}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import bottle from "@/public/bottle.webp";
import productImg from "@/public/headphone.jpeg";

export default function ProductGrid() {
  const products = [
    { id: 1, img: bottle, name: "This is a longer description for bottle." },
    { id: 2, img: productImg, name: "Product" },
    { id: 3, img: bottle, name: "Bottle 2" },
    { id: 4, img: productImg, name: "Product 2" },
    { id: 5, img: productImg, name: "Product 3" },
    { id: 6, img: productImg, name: "Product 4" },
    { id: 7, img: productImg, name: "Product 5" },
    { id: 8, img: productImg, name: "Product 6" },
    { id: 9, img: productImg, name: "Product 7" },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Just For You</h2>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border overflow-hidden 
                       shadow-sm hover:shadow-md hover:-translate-y-1 
                       transition duration-300 cursor-pointer"
          >
            <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
              <Image src={p.img} alt={p.name} fill className="object-cover" />
            </div>
            <div className="p-2">
              <h1 className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                {p.name}
              </h1>
              <h2 className="text-amber-500 text-[18px]">
                <span className="text-2xl">৳</span>1200
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

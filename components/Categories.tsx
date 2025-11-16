import Image from "next/image";
import Link from "next/link";

// Server-side data fetching function
async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/api/parent-category`,
      { cache: "no-store" } // 👈 FIX: always fetch fresh
    );

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const result = await res.json();

    if (!result.status || !result.data) {
      return [];
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function Categories() {
  const categories = await getCategories();

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Shop by Categories
      </h2>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm">No categories available.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {categories.map((c: any) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`}>
              <div
                className="bg-white shadow-sm hover:shadow-md hover:-translate-y-1 
                         transition duration-300 cursor-pointer rounded-md overflow-hidden"
              >
                <div className="relative w-full h-20 sm:h-24 md:h-28 overflow-hidden">
                  <Image
                    src={c.image || "/placeholder.jpg"}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

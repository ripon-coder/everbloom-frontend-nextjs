// Loading state components for Suspense boundaries

export function FlashSaleLoading() {
  return (
    <section className="relative py-6 px-4 bg-gray-50 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="h-8 w-32 bg-gray-300 rounded"></div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <div className="h-8 w-10 bg-gray-300 rounded"></div>
          <div className="h-8 w-10 bg-gray-300 rounded"></div>
          <div className="h-8 w-10 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="relative w-full h-64 md:h-96 bg-gray-300 rounded-lg"></div>
    </section>
  );
}

export function CategoriesLoading() {
  return (
    <div className="p-4 bg-gray-100 animate-pulse">
      <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white shadow-sm rounded">
            <div className="w-full h-20 sm:h-24 md:h-28 bg-gray-300 rounded-t"></div>
            <div className="p-2">
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductLoading() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen animate-pulse">
      <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white border rounded overflow-hidden shadow-sm">
            <div className="w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-300"></div>
            <div className="p-2">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NavLoading() {
  return (
    <header className="w-full border-b shadow-sm relative animate-pulse">
      <div className="hidden md:flex justify-between items-center px-4 py-2 text-sm bg-gray-50">
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="h-8 w-16 bg-gray-300 rounded"></div>
        <div className="hidden md:flex flex-1 max-w-3xl mx-auto">
          <div className="flex w-full">
            <div className="h-10 flex-1 bg-gray-300 rounded-l-lg"></div>
            <div className="h-10 w-12 bg-gray-300 rounded-r-lg"></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
          <div className="h-6 w-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </header>
  );
}
// components/ProductDescription.tsx
export default function ProductDescription({ description }: { description: string }) {
  return (
    <main className="bg-gray-50 p-3">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Product Information
        </h1>

        <section className="text-gray-700 leading-relaxed space-y-4">
          {description ? (
            <p>{description}</p>
          ) : (
            <p className="text-gray-500">No description available.</p>
          )}
        </section>
      </div>
    </main>
  );
}


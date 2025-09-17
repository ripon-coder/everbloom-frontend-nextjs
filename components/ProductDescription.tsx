
export default function ProductDescription() {
  return (
    <main className=" bg-gray-50 p-3">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Product Information
        </h1>

        <section className="text-gray-700 leading-relaxed space-y-4">
          <p>
            This modern chair is crafted with high-quality materials for maximum comfort and durability. 
            Its sleek design makes it a perfect addition to any living room, office, or study space.
          </p>
          <p>
            The ergonomic build supports proper posture, while the premium fabric finish ensures 
            both elegance and long-lasting use. 
          </p>
          <p>
            Available in multiple color options to suit your personal style and interior décor.
          </p>
        </section>
      </div>
    </main>
  );
}

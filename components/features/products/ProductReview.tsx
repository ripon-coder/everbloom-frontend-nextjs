"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date?: string;
}

export default function ProductReview() {
  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, name: "John Doe", rating: 5, comment: "Amazing product!", date: "2025-09-16" },
    { id: 2, name: "Jane Smith", rating: 4, comment: "Very good, but shipping was slow.", date: "2025-09-15" },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) return;

    const review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews([review, ...reviews]);
    setNewReview({ name: "", rating: 0, comment: "" });
  };

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((i) => (
      <FaStar
        key={i}
        className={i <= Math.round(rating) ? "text-amber-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <section className="product-reviews p-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h3>

      {/* Average Rating */}
      {reviews.length > 0 && (
        <div className="flex items-center mb-6 gap-2">
          <div className="flex">{renderStars(avgRating)}</div>
          <span className="text-gray-800 font-semibold">{avgRating.toFixed(1)}</span>
          <span className="text-gray-500">({reviews.length} reviews)</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-800">{review.name}</h4>
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FaStar key={i} className={i <= review.rating ? "text-amber-500" : "text-gray-300"} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            {review.date && <span className="text-gray-400 text-sm">{review.date}</span>}
          </div>
        ))}
      </div>

      {/* Add New Review */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm">
        <h4 className="text-lg font-semibold mb-4">Leave a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar
                key={i}
                size={24}
                className={`cursor-pointer ${i <= newReview.rating ? "text-amber-500" : "text-gray-300"}`}
                onClick={() => setNewReview({ ...newReview, rating: i })}
              />
            ))}
          </div>
          <textarea
            placeholder="Your Review"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            rows={4}
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          ></textarea>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded font-medium transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </section>
  );
}

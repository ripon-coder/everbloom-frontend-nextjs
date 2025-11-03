"use client";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

interface FlashSaleProps {
  initialData?: {
    active: boolean;
    endTime: string | null;
  };
}

// Flash Sale Timer Client Component
function FlashSaleTimer({ endTime, initialTimeLeft }: {
  endTime: string;
  initialTimeLeft: { hours: number; minutes: number; seconds: number } | null;
}) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  const calculateTimeLeft = () => {
    const diff = new Date(endTime).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  // Only run countdown on client
  useEffect(() => {
    // Initialize with server-provided time or calculate fresh
    if (!timeLeft) {
      setTimeLeft(calculateTimeLeft());
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  const isExpired = !timeLeft;

  if (isExpired) {
    return <span className="text-red-500 font-medium mt-2 md:mt-0">Flash Sale Ended</span>;
  }

  return (
    <div className="flex gap-2 text-sm font-medium mt-2 md:mt-0">
      <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
        {timeLeft.hours.toString().padStart(2, "0")}h
      </span>
      <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
        {timeLeft.minutes.toString().padStart(2, "0")}m
      </span>
      <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
        {timeLeft.seconds.toString().padStart(2, "0")}s
      </span>
    </div>
  );
}

export default function FlashSale({ initialData }: FlashSaleProps) {
  const flashSaleEndTime = initialData?.endTime || "2025-09-17T22:00:00";
  const isActive = initialData?.active !== false;

  // Calculate initial time left on server
  const calculateInitialTimeLeft = (endTime: string) => {
    const diff = new Date(endTime).getTime() - new Date().getTime();
    if (diff <= 0) return null;
    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const initialTimeLeft = calculateInitialTimeLeft(flashSaleEndTime);

  const isExpired = !timeLeft;

  return (
    <section className="flash-sale relative py-6 px-4 bg-gray-50">
      {/* Flash Sale timer */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-amber-500">Flash Sale</h2>
        {timeLeft ? (
          <div className="flex gap-2 text-sm font-medium mt-2 md:mt-0">
            <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
              {timeLeft.hours.toString().padStart(2, "0")}h
            </span>
            <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
              {timeLeft.minutes.toString().padStart(2, "0")}m
            </span>
            <span className="bg-amber-500 text-white rounded text-center w-10 py-1 inline-block">
              {timeLeft.seconds.toString().padStart(2, "0")}s
            </span>
          </div>
        ) : (
          <span className="text-red-500 font-medium mt-2 md:mt-0">Flash Sale Ended</span>
        )}
      </div>

      {/* Big image */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden shadow-lg">
        <img
          src="https://laz-img-cdn.alicdn.com/images/ims-web/TB1zCGTKNYaK1RjSZFnXXa80pXa.jpg"
          alt="Flash Sale"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

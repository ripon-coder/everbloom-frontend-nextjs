"use client";

import React, { useState, useEffect } from "react";

export default function FlashSaleComponent({
  slug,
  flashSale,
}: {
  slug: string;
  flashSale: {
    id: number;
    name: string;
    slug: string;
    banner_image: string | null;
    start_date: string;
    end_date: string;
  };
}) {
  if (!slug || !flashSale) return null;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(flashSale.end_date).getTime();
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [flashSale.end_date]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl shadow-md overflow-hidden">
        {/* Banner Image Background */}
        {flashSale.banner_image && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${flashSale.banner_image})` }}
          />
        )}
        
        <div className="relative z-10 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Banner Image Thumbnail - Now visible on all devices */}
              {flashSale.banner_image && (
                <div 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={openModal}
                >
                  <img 
                    src={flashSale.banner_image} 
                    alt={flashSale.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">
                  🔥 {flashSale.name}
                </h2>
              </div>
            </div>

            <div className="mt-3 sm:mt-0">
              {isExpired ? (
                <p className="text-sm font-semibold text-white/90">Sale has ended</p>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white/90">Ends in:</span>
                  <div className="flex space-x-1">
                    <div className="bg-black/20 px-2 py-1 rounded text-center min-w-[35px] sm:min-w-[40px]">
                      <div className="text-lg font-bold">{timeLeft.days}</div>
                      <div className="text-xs">DAYS</div>
                    </div>
                    <div className="bg-black/20 px-2 py-1 rounded text-center min-w-[35px] sm:min-w-[40px]">
                      <div className="text-lg font-bold">{timeLeft.hours}</div>
                      <div className="text-xs">HRS</div>
                    </div>
                    <div className="bg-black/20 px-2 py-1 rounded text-center min-w-[35px] sm:min-w-[40px]">
                      <div className="text-lg font-bold">{timeLeft.minutes}</div>
                      <div className="text-xs">MIN</div>
                    </div>
                    <div className="bg-black/20 px-2 py-1 rounded text-center min-w-[35px] sm:min-w-[40px]">
                      <div className="text-lg font-bold">{timeLeft.seconds}</div>
                      <div className="text-xs">SEC</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showModal && flashSale.banner_image && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
              onClick={closeModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={flashSale.banner_image} 
              alt={flashSale.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
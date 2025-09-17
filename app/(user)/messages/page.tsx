"use client";

import { useState } from "react";
import { FiTrash2, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import productImg from "@/public/headphone.jpeg"; // using product image

interface Message {
  id: number;
  sender: string;
  avatar: string;
  lastMessage: string;
  date: string;
  unread: boolean;
}

export default function MessagesPage() {
  const allMessages: Message[] = [
    { id: 1, sender: "Wireless Headphone", avatar: productImg, lastMessage: "Order shipped today!", date: "Sep 15", unread: true },
    { id: 2, sender: "Bottle", avatar: productImg, lastMessage: "Your order is being processed.", date: "Sep 14", unread: false },
    { id: 3, sender: "Smart Watch", avatar: productImg, lastMessage: "Delivered successfully.", date: "Sep 13", unread: true },
    { id: 4, sender: "Gaming Mouse", avatar: productImg, lastMessage: "Your order is pending.", date: "Sep 12", unread: false },
    { id: 5, sender: "Backpack", avatar: productImg, lastMessage: "Order canceled.", date: "Sep 10", unread: false },
  ];

  const [messages, setMessages] = useState(allMessages.slice(0, 3));

  const deleteMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const loadMore = () => {
    const currentLength = messages.length;
    setMessages([...messages, ...allMessages.slice(currentLength, currentLength + 3)]);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Messages</h1>

        {messages.length === 0 && <p className="text-gray-500">No messages.</p>}

        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`bg-white border ${msg.unread ? "border-amber-500" : "border-gray-300"} p-3 rounded-md flex items-center justify-between`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative flex-shrink-0">
                  <Image src={msg.avatar} alt={msg.sender} fill className="object-cover rounded" />
                </div>
                <div>
                  <h2 className="font-medium text-gray-800">{msg.sender}</h2>
                  <p className="text-gray-500 text-sm truncate max-w-xs">{msg.lastMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-gray-400 text-xs">{msg.date}</p>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded-md transition"
                >
                  <FiTrash2 />
                </button>
                <FiChevronRight className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {messages.length < allMessages.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              className="bg-amber-500 text-white px-5 py-2 rounded-md hover:bg-amber-600 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

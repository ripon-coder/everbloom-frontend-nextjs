"use client";

import Image from "next/image";
import { FiSend } from "react-icons/fi";
import productImg from "@/public/headphone.jpeg"; // placeholder
import { useState } from "react";

interface ChatMessage {
  id: number;
  sender: "user" | "support";
  text: string;
  date: string;
}

export default function MessagePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "support",
      text: "Hi! Your order has been shipped.",
      date: "Sep 15, 10:00 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "Thank you! Can you provide the tracking number?",
      date: "Sep 15, 10:05 AM",
    },
    {
      id: 3,
      sender: "support",
      text: "Sure! Tracking ID: SH123456789.",
      date: "Sep 15, 10:10 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text: newMessage,
        date: new Date().toLocaleString(),
      },
    ]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto flex flex-col h-[80vh] bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-200">
          <div className="w-12 h-12 relative">
            <Image
              src={productImg}
              alt="Product"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <h2 className="font-medium text-gray-800">Wireless Headphone</h2>
        </div>

        {/* Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "support" && (
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src={productImg}
                    alt="Support"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-amber-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none ml-2"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-white mt-1 text-right">
                  {msg.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex p-4 border-t border-gray-200 gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center bg-amber-500 text-white rounded-full px-4 py-2 hover:bg-amber-600 transition"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+880123456789",
    address: "Dhaka, Bangladesh",
    avatar: "/default-avatar.png",
  });

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [preview, setPreview] = useState<string | null>(user.avatar);

  const handleSave = () => {
    setUser({ ...formData, avatar: preview || user.avatar });
    setEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="w-full max-w-5xl mx-auto bg-white p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition"
          >
            <FiEdit /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            <img
              src={preview || user.avatar}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border"
            />
            {editing && (
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full cursor-pointer hover:bg-amber-600 text-white"
              >
                <FiEdit size={16} />
              </label>
            )}
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {["name", "email", "phone", "address"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600 capitalize">
                {field}
              </label>
              {editing ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  value={(formData as any)[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              ) : (
                <p className="text-gray-800">{(user as any)[field]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {editing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="bg-amber-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-amber-600 transition"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

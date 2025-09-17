"use client";

import { useState } from "react";
import { FiCamera } from "react-icons/fi";

export default function ProfileEditPage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+880123456789",
    address: "Dhaka, Bangladesh",
    password: "",
    avatar: "/default-avatar.png",
  });

  const [preview, setPreview] = useState<string | null>(profile.avatar);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...profile, avatar: preview || profile.avatar });
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="w-full max-w-5xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <img
                src={preview || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border"
              />
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full cursor-pointer hover:bg-amber-600 text-white"
              >
                <FiCamera size={16} />
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </div>
            <div>
              <p className="font-medium text-gray-700">Profile Picture</p>
              <p className="text-gray-400 text-sm">
                Upload a square image for best result.
              </p>
            </div>
          </div>

          {/* Input Fields */}
          {["name", "email", "phone", "address", "password"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field === "password" ? "Password" : field}
              </label>
              <input
                type={field === "email" ? "email" : field === "password" ? "password" : "text"}
                name={field}
                value={(profile as any)[field]}
                onChange={handleChange}
                placeholder={field === "password" ? "Enter new password" : ""}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-amber-500 text-white px-6 py-2 rounded-md font-medium hover:bg-amber-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  profile_image: string;
  created_at: string | null;
  updated_at: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile/get-profile");
        const data = await res.json();
        if (data.status) {
          setUser(data.data);
          setFormData({
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone,
          });
          setPreview(data.data.profile_image);
        } else {
          toast.error(data.message || "Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Image change preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Save Profile
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      if (imageFile) {
        formDataObj.append("profile_image", imageFile);
      }

      const res = await fetch("/api/profile/save-profile", {
        method: "POST",
        body: formDataObj,
      });

      const data = await res.json();

      if (data.status) {
        toast.success(data.message || "Profile updated successfully");

        setUser({
          ...user,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          profile_image: imageFile ? preview! : data.data.profile_image,
          updated_at: data.data.updated_at,
        });

        setEditing(false);
        setImageFile(null);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving profile");
    } finally {
      setSaving(false);
    }
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="w-full bg-white p-6 rounded-lg shadow animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
        <div className="h-8 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="flex items-center gap-6 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-full"></div>
          <div className="h-6 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center py-4 px-5">{renderSkeleton()}</div>
    );
  if (!user)
    return (
      <div className="flex justify-center items-center py-4 px-5 text-red-500">
        Failed to load profile
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 text-amber-500 hover:text-amber-600 transition cursor-pointer"
          >
            <FiEdit /> {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex items-center gap-6 mb-6">
          <div className="relative w-24 h-24">
            {saving ? (
              <div className="w-full h-full rounded-full bg-gray-300 animate-pulse"></div>
            ) : (
              <img
                src={preview || user.profile_image}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border"
              />
            )}
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
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {["name", "email", "phone"].map((field) => (
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
                <div className="flex items-center gap-2">
                  <p className="text-gray-800">{(user as any)[field]}</p>
                  {field === "email" && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.email_verified_at ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.email_verified_at ? "Verified" : "Not Verified"}
                    </span>
                  )}
                  {field === "phone" && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        user.phone_verified_at ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.phone_verified_at ? "Verified" : "Not Verified"}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        {editing && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-amber-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-amber-600 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

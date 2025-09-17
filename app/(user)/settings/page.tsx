"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Settings Updated Successfully!");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notifications */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-700">Notifications</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
              />
              Enable Email Notifications
            </label>
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-gray-700">Theme</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="darkMode"
                checked={settings.darkMode}
                onChange={handleChange}
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
              />
              Dark Mode
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-amber-500 text-white px-6 py-2 rounded-md font-medium hover:bg-amber-600 transition"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

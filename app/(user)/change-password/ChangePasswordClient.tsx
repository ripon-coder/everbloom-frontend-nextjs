"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  }>({});

  // Render a password input with eye toggle and validation error
  const renderPasswordInput = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    setShow: (val: boolean) => void,
    placeholder: string,
    fieldName: string
  ) => (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 ${
            validationErrors[fieldName] ? "border-red-500" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {validationErrors[fieldName] &&
        validationErrors[fieldName].map((msg, idx) => (
          <p key={idx} className="text-red-500 text-sm mt-1">
            {msg}
          </p>
        ))}
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.status === 422) {
        setValidationErrors(data.errors);
        return;
      }

      if (data.status) {
        toast.success(data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while changing password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 w-full  rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Change Password
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderPasswordInput(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            setShowCurrent,
            "Enter current password",
            "current_password"
          )}

          {renderPasswordInput(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            setShowNew,
            "Enter new password",
            "new_password"
          )}

          {renderPasswordInput(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            setShowConfirm,
            "Confirm new password",
            "new_password_confirmation"
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-40 bg-amber-500 text-white py-2 px-2 rounded-md hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

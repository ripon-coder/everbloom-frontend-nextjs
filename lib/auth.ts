"use client";

import { toast } from "react-hot-toast";

export async function logoutUser() {
  await toast.promise(
    (async () => {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Failed to logout");
      }

      // Redirect to login page after successful logout
      window.location.href = "/login";
    })(),
    {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: (err) => err.message || "Failed to logout",
    }
  );
}

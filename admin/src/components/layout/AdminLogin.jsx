"use client";

import React from "react";
import Logo from "../ui/Logo";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL || "/AdminDashboard";
    router.push(target);
  };

  return (
    <div className="w-[400px] flex flex-col items-center">
      {/* logo */}
      <Logo />

      {/* form */}
      <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
        <div className="user-input-section">
          <label htmlFor="userName">Admin User Name</label>
          <input
            id="userName"
            type="text"
            name="userName"
            placeholder="BRA-9020"
            required
            autoComplete="username"
          />
        </div>

        <div className="user-input-section">
          <label htmlFor="password">Admin Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="***********"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </div>
  );
}

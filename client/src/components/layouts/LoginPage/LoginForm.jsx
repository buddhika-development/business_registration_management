'use client';
import { api } from "@/lib/apiClient";
import axios from "axios";
import React, { useState } from "react";

const LoginForm = () => {

  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post('/api/client/login', {
        nic,
        password,
      });

      const accessToken = res?.data?.data?.AccessToken;
      const { refreshToken } = res?.data?.token || {};

      if (!accessToken) {
        console.warn("Unexpected login response:", res?.data);
        throw new Error("No access token returned from server.");
      }

      sessionStorage.setItem("ACCESS_TOKEN", accessToken);
      console.log("Login successful, access token set in session storage.", accessToken);

    } catch (e) {
      const serverMsg = e?.response?.data?.errors?.message;
      setErr(serverMsg || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-900">
          Login
        </h1>

        <form onSubmit={onSubmit} method="post" className="mt-8 space-y-5 ">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              NIC :
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-sm text-gray-700
                         placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              placeholder="Enter NIC number"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Password :
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3 text-sm text-gray-700
                         placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {err && <p className="text-red-600 text-sm">{err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#5252C9] px-6 py-3 text-sm font-semibold text-white
                       hover:brightness-105 active:brightness-95 transition"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;

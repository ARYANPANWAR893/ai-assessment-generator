"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      login(email, name);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-[24px] p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Create Instructor Account</h1>
          <p className="text-xs text-neutral-400">Establish your educational workspace instance.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-900"
              placeholder="Professor Logan"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-900"
              placeholder="name@university.edu"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-900"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Initialize Account
          </button>
        </form>
        <p className="text-center text-xs text-neutral-400">
          Already registered?{" "}
          <Link href="/login" className="text-neutral-900 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
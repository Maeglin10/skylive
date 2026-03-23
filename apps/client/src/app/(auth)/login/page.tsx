'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await login({ email, password });
      toast.success("Welcome back!", {
        description: "Successfully signed into your Skylive account."
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
      toast.error("Login failed", {
        description: err?.response?.data?.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="w-full max-w-md space-y-8 animate-scale-in">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-black tracking-tighter text-[#9E398D]">SKYLIVE</h1>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-neutral-400">Unlock your world of content</p>
        </div>

        <div className="p-8 bg-[#0a0a0a]/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">Password</label>
                <Link href="#" className="text-[10px] uppercase font-bold text-[#9E398D] hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl gradient-primary text-white font-bold tracking-widest uppercase text-sm shadow-[0_10px_20px_-5px_rgba(158,57,141,0.3)] hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#9E398D] font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

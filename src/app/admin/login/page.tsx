'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@ishara.com.bd');
  const [password, setPassword] = useState('IsharaAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to authenticate');
        setIsLoading(false);
        return;
      }

      // Successful login -> route to /admin
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#201a1c] flex items-center justify-center p-4">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#b45f77]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#c5a880]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#2c2527] border border-[#3d3437] rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-40 h-14 mx-auto">
            <Image
              src="/images/ishara-logo.png"
              alt="Ishara Brand"
              fill
              className="object-contain brightness-125"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Staff Backoffice Access</h1>
            <p className="text-xs text-[#8c7e83] mt-0.5">
              Secure administrative gateway for Ishara operations
            </p>
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#ded5d7] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#201a1c] border border-[#3d3437] rounded-xl text-sm text-white focus:outline-none focus:border-[#b45f77] focus:ring-1 focus:ring-[#b45f77]"
                placeholder="admin@ishara.com.bd"
              />
              <Mail className="w-4 h-4 text-[#8c7e83] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#ded5d7] uppercase tracking-wider mb-1.5">
              Secret Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[#201a1c] border border-[#3d3437] rounded-xl text-sm text-white focus:outline-none focus:border-[#b45f77] focus:ring-1 focus:ring-[#b45f77]"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-[#8c7e83] absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-[#8c7e83] hover:text-white absolute right-3 top-2.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#201a1c]/60 border border-[#3d3437] text-[11px] text-[#8c7e83]">
            Default credentials for developer setup:
            <br />
            <strong className="text-rose-300 font-mono">admin@ishara.com.bd</strong> /{' '}
            <strong className="text-rose-300 font-mono">IsharaAdmin2026!</strong>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-[#b45f77] hover:bg-[#9e4a62] disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-[#8c7e83] hover:text-white transition-colors underline"
          >
            ← Back to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

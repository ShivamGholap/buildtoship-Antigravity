import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { DisclaimerBanner } from "./DisclaimerBanner.jsx";
import { Footer } from "./Footer.jsx";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <DisclaimerBanner language="en" forceShow={false} />
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-stone-900 leading-tight block">
                KrishiMitra <span className="text-brand-700 text-xs px-1.5 py-0.5 bg-brand-50 border border-brand-200 rounded-md font-semibold">AI</span>
              </span>
              <span className="text-[11px] text-stone-500 hidden sm:block">Crop Advisory Assistant</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-stone-700 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-100 min-h-[44px] flex items-center transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-brand-700 hover:bg-brand-800 text-white px-4 py-2 rounded-lg shadow-sm min-h-[44px] flex items-center transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

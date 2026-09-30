import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Sprout, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="w-14 h-14 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto">
          <Sprout className="w-7 h-7" />
        </div>
        <span className="text-4xl font-extrabold text-stone-900 block">404</span>
        <h1 className="text-xl font-bold text-stone-900">Page Not Found</h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
          The agricultural advisory page or farm resource you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

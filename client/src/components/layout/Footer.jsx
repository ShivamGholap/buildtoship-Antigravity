import React from "react";
import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 mt-auto py-8 px-4 text-xs text-stone-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-700 text-white flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-semibold text-stone-800">KrishiMitra AI</span>
          <span>&copy; {new Date().getFullYear()} - Agricultural Advisory Assistant</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/profile" className="hover:text-stone-900 transition-colors">
            Farmer Profile
          </Link>
          <a
            href="https://icar.org.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 transition-colors"
          >
            ICAR / KVK Portal
          </a>
          <span className="text-stone-400">|</span>
          <span className="italic">Empowering farmers with AI science</span>
        </div>
      </div>
    </footer>
  );
}

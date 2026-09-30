import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProfile } from "../../hooks/useProfile.js";
import { DisclaimerBanner } from "./DisclaimerBanner.jsx";
import { Footer } from "./Footer.jsx";
import {
  Sprout,
  Home,
  PlusCircle,
  History,
  Trees,
  User,
  LogOut,
  Globe
} from "lucide-react";
import { t } from "../../lib/i18n.js";

export function AppLayout() {
  const { signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = profile?.language || "en";

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    if (profile) {
      await updateProfile({ ...profile, language: newLang });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  const navLinks = [
    { to: "/dashboard", label: t("nav.dashboard", currentLang), icon: Home },
    { to: "/advisories", label: t("nav.advisories", currentLang), icon: History },
    { to: "/farms", label: t("nav.farms", currentLang), icon: Trees },
  ];

  const mobileTabs = [
    { to: "/dashboard", label: "Home", icon: Home },
    { to: "/advisories", label: "History", icon: History },
    { to: "/advisory/new", label: "Advisory", icon: PlusCircle, isMain: true },
    { to: "/farms", label: "Farms", icon: Trees },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 pb-16 md:pb-0">
      {/* Disclaimer Banner at top */}
      <DisclaimerBanner language={currentLang} />

      {/* Top Navbar for desktop */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white flex items-center justify-center shadow-sm group-hover:bg-brand-800 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-stone-900 leading-tight block">
                KrishiMitra <span className="text-brand-700 text-xs px-1.5 py-0.5 bg-brand-50 border border-brand-200 rounded-md font-semibold">AI</span>
              </span>
              <span className="text-[11px] text-stone-500 hidden sm:block">Crop Advisory Assistant</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-brand-50 text-brand-800 font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* New Advisory CTA (desktop) */}
            <Link
              to="/advisory/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-700 text-white hover:bg-brand-800 text-sm font-medium rounded-lg shadow-sm transition-colors min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t("nav.newAdvisory", currentLang)}</span>
            </Link>

            {/* Language switcher */}
            <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200 text-xs min-h-[44px]">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={currentLang}
                onChange={handleLanguageChange}
                className="bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </div>

            {/* User Profile / Logout */}
            <div className="flex items-center gap-1">
              <Link
                to="/profile"
                className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                title="Profile"
                aria-label="Farmer Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Tab Bar (fixed on small screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 shadow-lg no-print">
        <div className="flex items-center justify-around">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              location.pathname === tab.to ||
              (tab.to !== "/dashboard" && location.pathname.startsWith(tab.to));

            if (tab.isMain) {
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className="flex flex-col items-center justify-center -mt-5 min-h-[48px] min-w-[48px]"
                  aria-label={tab.label}
                >
                  <div className="w-12 h-12 rounded-full bg-brand-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold text-brand-800 mt-0.5">
                    {tab.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[11px] font-medium min-h-[48px] min-w-[48px] transition-colors ${
                  isActive ? "text-brand-700 font-semibold" : "text-stone-500 hover:text-stone-900"
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-brand-700" : "text-stone-500"}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

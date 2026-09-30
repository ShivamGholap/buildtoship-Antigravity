import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProfile } from "../hooks/useProfile.js";
import { useFarms } from "../hooks/useFarms.js";
import { useAdvisories } from "../hooks/useAdvisories.js";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { EmptyFarmsState } from "../components/farms/EmptyFarmsState.jsx";
import { AdvisoryListItem } from "../components/history/AdvisoryListItem.jsx";
import {
  Sprout,
  PlusCircle,
  Trees,
  History,
  Compass,
  AlertCircle,
  FlaskConical,
  Droplets,
  CalendarDays,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { farms, loading: farmsLoading } = useFarms();
  const { fetchAdvisories } = useAdvisories();

  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [loadingAdvisories, setLoadingAdvisories] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchAdvisories({ limit: 5 })
      .then((data) => {
        if (isMounted) {
          setRecentAdvisories(data.items || []);
          setLoadingAdvisories(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingAdvisories(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchAdvisories]);

  if (farmsLoading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Spinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  const farmerName = profile?.full_name || user?.user_metadata?.full_name || "Farmer";
  const farmerDistrict = profile?.district ? `${profile.district}, ${profile.state}` : null;

  const quickActions = [
    {
      title: "Crop Recommendation",
      icon: Compass,
      href: "/advisory/crop-recommendation",
      color: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200",
    },
    {
      title: "Pest / Disease Diagnosis",
      icon: AlertCircle,
      href: "/advisory/disease-diagnosis",
      color: "text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200",
    },
    {
      title: "Fertilizer Schedule",
      icon: FlaskConical,
      href: "/advisory/fertilizer-plan",
      color: "text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200",
    },
    {
      title: "Irrigation Schedule",
      icon: Droplets,
      href: "/advisory/irrigation-plan",
      color: "text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      title: "Crop Calendar",
      icon: CalendarDays,
      href: "/advisory/seasonal-calendar",
      color: "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-200 block mb-1">
              Farmer Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Namaste, {farmerName}!
            </h1>
            <p className="text-sm text-brand-100 mt-1 max-w-xl">
              {farmerDistrict
                ? `Ready to generate customized agronomy advice for your farms in ${farmerDistrict}.`
                : "Welcome to KrishiMitra AI. Grounded agricultural science at your fingertips."}
            </p>
          </div>

          <Link to="/advisory/new">
            <Button
              variant="white"
              size="lg"
              className="font-semibold shrink-0"
              icon={Sparkles}
            >
              Start New Advisory
            </Button>
          </Link>
        </div>

        {/* Subtle decorative background icon */}
        <Sprout className="w-64 h-64 text-white/5 absolute -right-12 -bottom-16 pointer-events-none" />
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 sm:p-5 border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium block">Registered Farms</span>
              <span className="text-xl font-bold text-stone-900">{farms.length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium block">Total Advisories</span>
              <span className="text-xl font-bold text-stone-900">{recentAdvisories.length}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium block">Preferred Language</span>
              <span className="text-sm font-bold text-stone-900 capitalize">
                {profile?.language === "hi" ? "हिन्दी" : profile?.language === "mr" ? "मराठी" : "English"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium block">Measurement Unit</span>
              <span className="text-sm font-bold text-stone-900 capitalize">
                {profile?.preferred_unit || "Acres"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Launch Advisory Cards */}
      <div>
        <h2 className="text-base font-bold text-stone-900 mb-3 flex items-center justify-between">
          <span>Quick Advisory Launch</span>
          <Link to="/advisory/new" className="text-xs text-brand-700 hover:underline">
            View all 5 engines →
          </Link>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((qa, idx) => {
            const Icon = qa.icon;
            return (
              <Link key={idx} to={qa.href} className="block group">
                <Card
                  hover
                  className={`p-4 text-center border h-full flex flex-col items-center justify-center transition-all ${qa.color}`}
                >
                  <Icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold leading-tight">{qa.title}</span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Recent Advisories & Farms Glances */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Advisories */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">Recent Advisories</h2>
            <Link
              to="/advisories"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingAdvisories ? (
            <div className="py-8 flex justify-center">
              <Spinner message="Loading recent advisories..." />
            </div>
          ) : recentAdvisories.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-stone-300">
              <History className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h3 className="font-semibold text-stone-700 text-sm">No Advisories Generated Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                Generate your first advisory to receive custom crop recommendations, disease diagnosis, or nutrient plans.
              </p>
              <Link to="/advisory/new">
                <Button size="sm" variant="primary">
                  Generate First Advisory
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentAdvisories.map((advisory) => (
                <AdvisoryListItem key={advisory.id} advisory={advisory} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Farms Glance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">My Farms ({farms.length})</h2>
            <Link
              to="/farms"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {farms.length === 0 ? (
            <EmptyFarmsState />
          ) : (
            <div className="space-y-3">
              {farms.slice(0, 3).map((f) => (
                <Card key={f.id} className="p-4 border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{f.name}</h4>
                      <p className="text-xs text-stone-500">
                        {f.district}, {f.state}
                      </p>
                    </div>
                    <Badge variant="brand" className="text-xs">
                      {f.land_size} {f.land_unit}
                    </Badge>
                  </div>
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                    <span>Soil: <strong>{f.soil_type}</strong></span>
                    <span>Water: <strong>{f.water_availability}</strong></span>
                  </div>
                </Card>
              ))}

              <Link to="/farms/new" className="block pt-1">
                <Button variant="outline" size="sm" icon={PlusCircle} className="w-full">
                  Add Another Farm
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

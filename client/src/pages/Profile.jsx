import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema } from "../lib/schemas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useProfile } from "../hooks/useProfile.js";
import { PageHeader } from "../components/ui/PageHeader.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { Button } from "../components/ui/Button.jsx";
import { ConfirmDialog } from "../components/ui/ConfirmDialog.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import {
  User,
  ShieldAlert,
  Trash2,
  CheckCircle,
  Save,
  Globe,
  Compass
} from "lucide-react";
import toast from "react-hot-toast";

export function Profile() {
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile, deleteUserData } = useProfile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isOnboarding = searchParams.get("onboarding") === "true" || (profile && !profile.onboarded);

  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    values: {
      full_name: profile?.full_name || user?.user_metadata?.full_name || "",
      phone: profile?.phone || "",
      state: profile?.state || "",
      district: profile?.district || "",
      language: profile?.language || "en",
      preferred_unit: profile?.preferred_unit || "acre",
    },
  });

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      await updateProfile(data);
      if (isOnboarding) {
        navigate("/farms/new");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      setDeleting(true);
      await deleteUserData();
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Delete data error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Spinner size="lg" message="Loading farmer profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* First-time onboarding banner */}
      {isOnboarding && (
        <div className="bg-brand-50 p-5 rounded-2xl border border-brand-200 shadow-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-brand-900 leading-relaxed">
            <h3 className="font-bold text-brand-950 mb-0.5">Welcome to KrishiMitra AI!</h3>
            <p>
              Please complete your basic profile (location and preferred language) to personalize your crop advisories. Once saved, you will be guided to add your first farm.
            </p>
          </div>
        </div>
      )}

      <PageHeader
        title="Farmer Profile & Settings"
        subtitle="Manage your location, preferred language for AI responses, and measurement units."
      />

      {/* Main Profile Form */}
      <Card className="border-stone-200">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">Account Identity</h3>
                <span className="text-xs text-stone-400">{user?.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Ramesh Patil"
                required
                error={errors.full_name?.message}
                {...register("full_name")}
              />

              <Input
                label="Mobile Phone (Optional)"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="State"
                placeholder="e.g. Maharashtra, Punjab"
                required
                error={errors.state?.message}
                {...register("state")}
              />

              <Input
                label="District"
                placeholder="e.g. Nashik, Ludhiana"
                required
                error={errors.district?.message}
                {...register("district")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
              <Select
                label="AI Advisory Language"
                options={[
                  { value: "en", label: "English" },
                  { value: "hi", label: "हिन्दी (Hindi)" },
                  { value: "mr", label: "मराठी (Marathi)" },
                ]}
                required
                error={errors.language?.message}
                {...register("language")}
              />

              <Select
                label="Preferred Area Unit"
                options={[
                  { value: "acre", label: "Acres (एकड़)" },
                  { value: "hectare", label: "Hectares (हेक्टेयर)" },
                ]}
                required
                error={errors.preferred_unit?.message}
                {...register("preferred_unit")}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" loading={saving} icon={Save}>
                {isOnboarding ? "Save Profile & Continue" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Privacy & Danger Zone */}
      <Card className="border-red-200 bg-red-50/20">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-red-950 text-base">Privacy & Data Control</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                In compliance with privacy and data protection rights, you can permanently erase all your farm records, advisory history, diagnostic images, and follow-up messages from our systems.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-red-100">
            <span className="text-xs text-stone-500">
              This action is permanent and cannot be undone.
            </span>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAllData}
        loading={deleting}
        title="Permanently Delete All Your Data?"
        message="This will immediately delete your farmer profile, all registered farms, all past advisories, all uploaded photos, and all chat history. You will be signed out immediately."
        confirmText="Yes, Delete Everything"
      />
    </div>
  );
}

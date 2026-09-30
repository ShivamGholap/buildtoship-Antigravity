import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../lib/schemas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Sprout, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);
      await signUp({
        email: data.email,
        password: data.password,
        full_name: data.full_name,
      });
      toast.success("Account created successfully!");
      // Redirect to profile onboarding per Section 7
      navigate("/profile?onboarding=true", { replace: true });
    } catch (err) {
      const msg = err.message || "Failed to create account";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Create Farmer Account</h1>
          <p className="text-sm text-stone-500 mt-1">
            Free scientific crop advisory for your farm and crops
          </p>
        </div>

        <Card className="border-stone-200/80 shadow-md">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                  {serverError}
                </div>
              )}

              <Input
                label="Full Name"
                placeholder="e.g. Ramesh Patil"
                required
                error={errors.full_name?.message}
                {...register("full_name")}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="farmer@example.com"
                required
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                required
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                required
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={UserPlus}
                className="w-full mt-2"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
              Already registered?{" "}
              <Link to="/login" className="text-brand-700 font-semibold hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

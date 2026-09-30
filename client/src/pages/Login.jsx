import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/schemas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Sprout, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);
      await signIn(data);
      toast.success("Welcome back!");
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      const msg = err.message || "Invalid email or password";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Sign in to KrishiMitra</h1>
          <p className="text-sm text-stone-500 mt-1">
            Access your saved farm profiles and AI crop advisories
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
                label="Email Address"
                type="email"
                placeholder="farmer@example.com"
                required
                error={errors.email?.message}
                {...register("email")}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-stone-700">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  error={errors.password?.message}
                  {...register("password")}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={LogIn}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-500">
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-brand-700 font-semibold hover:underline">
                Create free account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

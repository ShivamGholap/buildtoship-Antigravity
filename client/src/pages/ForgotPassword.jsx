import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../lib/schemas.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent } from "../components/ui/Card.jsx";
import { Sprout, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await resetPassword(data.email);
      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Reset Your Password</h1>
          <p className="text-sm text-stone-500 mt-1">
            We will send a secure link to your email to choose a new password
          </p>
        </div>

        <Card className="border-stone-200/80 shadow-md">
          <CardContent className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 bg-brand-50 text-brand-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Check Your Email</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We've sent a password reset link to your email address. Follow the link in that email to set a new password.
                </p>
                <Link to="/login" className="inline-block pt-2">
                  <Button variant="outline" size="sm" icon={ArrowLeft}>
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="farmer@example.com"
                  required
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Mail}
                  className="w-full mt-2"
                >
                  Send Reset Link
                </Button>

                <div className="pt-4 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

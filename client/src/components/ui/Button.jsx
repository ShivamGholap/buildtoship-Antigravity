import React from "react";
import { Loader2 } from "lucide-react";

export const Button = React.forwardRef(function Button(
  {
    children,
    type = "button",
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = "left",
    className = "",
    ...props
  },
  ref
) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none min-h-[44px] cursor-pointer";

  const variants = {
    primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-sm active:bg-brand-900",
    secondary: "bg-earth-100 text-stone-800 hover:bg-earth-200 border border-earth-300",
    outline: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm active:bg-red-800",
    ghost: "text-stone-600 hover:text-stone-900 hover:bg-stone-100",
    white: "bg-white text-brand-900 hover:bg-stone-100 shadow-md border border-transparent active:bg-stone-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs min-h-[38px]",
    md: "px-4 py-2 text-sm min-h-[44px]",
    lg: "px-5 py-2.5 text-base min-h-[48px]",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4 mr-2 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4 ml-2 shrink-0" />}
    </button>
  );
});

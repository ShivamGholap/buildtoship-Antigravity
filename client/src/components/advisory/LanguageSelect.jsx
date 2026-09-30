import React from "react";
import { Select } from "../ui/Select.jsx";

export const LanguageSelect = React.forwardRef(function LanguageSelect(
  {
    label = "Response Language (परामर्श भाषा)",
    value,
    onChange,
    error,
    name = "language",
    className = "",
    ...props
  },
  ref
) {
  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिन्दी (Hindi)" },
    { value: "mr", label: "मराठी (Marathi)" },
  ];

  return (
    <Select
      ref={ref}
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      options={languages}
      error={error}
      required
      className={className}
      helperText="AI advisory will be written in the chosen language."
      {...props}
    />
  );
});

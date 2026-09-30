import { z } from "zod";

export const farmSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Farm name must be at least 2 characters")
    .max(80, "Farm name must not exceed 80 characters"),
  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(60, "State must not exceed 60 characters"),
  district: z
    .string()
    .trim()
    .min(2, "District must be at least 2 characters")
    .max(60, "District must not exceed 60 characters"),
  land_size: z.coerce
    .number()
    .positive("Land size must be greater than 0")
    .max(100000, "Land size cannot exceed 100,000"),
  land_unit: z.enum(["acre", "hectare"]).default("acre"),
  soil_type: z.enum([
    "black_cotton",
    "red",
    "alluvial",
    "laterite",
    "sandy",
    "loamy",
    "clayey",
    "saline_alkaline",
    "unknown"
  ]).default("unknown"),
  soil_ph: z.coerce
    .number()
    .min(3.0, "Soil pH must be at least 3.0")
    .max(10.0, "Soil pH cannot exceed 10.0")
    .optional()
    .nullable()
    .or(z.literal("")),
  organic_carbon_level: z
    .enum(["low", "medium", "high"])
    .optional()
    .nullable()
    .or(z.literal("")),
  irrigation_source: z.enum([
    "rainfed",
    "borewell",
    "open_well",
    "canal",
    "river_lift",
    "farm_pond",
    "drip_installed",
    "sprinkler_installed"
  ]).default("rainfed"),
  water_availability: z.enum([
    "scarce",
    "limited",
    "adequate",
    "abundant"
  ]).default("limited"),
  current_crop: z
    .string()
    .trim()
    .max(60, "Current crop name must not exceed 60 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  previous_crop: z
    .string()
    .trim()
    .max(60, "Previous crop name must not exceed 60 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(500, "Farm notes must not exceed 500 characters")
    .optional()
    .nullable()
    .or(z.literal("")),
}).strict().transform((data) => ({
  ...data,
  soil_ph: data.soil_ph === "" ? null : data.soil_ph,
  organic_carbon_level: data.organic_carbon_level === "" ? null : data.organic_carbon_level,
  current_crop: data.current_crop === "" ? null : data.current_crop,
  previous_crop: data.previous_crop === "" ? null : data.previous_crop,
  notes: data.notes === "" ? null : data.notes,
}));

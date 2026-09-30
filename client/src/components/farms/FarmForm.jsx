import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { farmFormSchema } from "../../lib/schemas.js";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";
import { useMeta } from "../../hooks/useMeta.js";

export function FarmForm({ initialData = {}, onSubmit, onCancel, loading = false }) {
  const { options } = useMeta();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: initialData.name || "",
      state: initialData.state || "",
      district: initialData.district || "",
      land_size: initialData.land_size || "",
      land_unit: initialData.land_unit || "acre",
      soil_type: initialData.soil_type || "unknown",
      soil_ph: initialData.soil_ph != null ? String(initialData.soil_ph) : "",
      organic_carbon_level: initialData.organic_carbon_level || "",
      irrigation_source: initialData.irrigation_source || "rainfed",
      water_availability: initialData.water_availability || "limited",
      current_crop: initialData.current_crop || "",
      previous_crop: initialData.previous_crop || "",
      notes: initialData.notes || "",
    },
  });

  const notesValue = watch("notes");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Farm Details */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Basic Farm Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Farm Name"
            placeholder="e.g. Ganga River Plot, North Field"
            required
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Land Size"
              type="number"
              step="0.01"
              placeholder="e.g. 5"
              required
              error={errors.land_size?.message}
              {...register("land_size")}
            />
            <Select
              label="Unit"
              options={options?.areaUnits || [
                { value: "acre", label: "Acre" },
                { value: "hectare", label: "Hectare" }
              ]}
              required
              error={errors.land_unit?.message}
              {...register("land_unit")}
            />
          </div>
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
      </div>

      {/* Soil & Water Profile */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Soil & Water Characteristics
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Soil Type"
            options={options?.soilTypes || []}
            required
            error={errors.soil_type?.message}
            {...register("soil_type")}
          />

          <Input
            label="Soil pH (Optional)"
            type="number"
            step="0.1"
            placeholder="e.g. 6.5 - 7.5"
            helperText="Normal agricultural soil: 6.0 to 8.0"
            error={errors.soil_ph?.message}
            {...register("soil_ph")}
          />

          <Select
            label="Organic Carbon (Optional)"
            placeholder="Select level (if tested)"
            options={[
              { value: "low", label: "Low (< 0.5%)" },
              { value: "medium", label: "Medium (0.5% - 0.75%)" },
              { value: "high", label: "High (> 0.75%)" },
            ]}
            error={errors.organic_carbon_level?.message}
            {...register("organic_carbon_level")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Irrigation Source"
            options={options?.irrigationSources || []}
            required
            error={errors.irrigation_source?.message}
            {...register("irrigation_source")}
          />

          <Select
            label="Water Availability"
            options={options?.waterAvailability || []}
            required
            error={errors.water_availability?.message}
            {...register("water_availability")}
          />
        </div>
      </div>

      {/* Crop History & Field Notes */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Crop History & Notes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Current Standing Crop (Optional)"
            placeholder="e.g. Cotton, Soybean, Wheat"
            error={errors.current_crop?.message}
            {...register("current_crop")}
          />

          <Input
            label="Previous Season Crop (Optional)"
            placeholder="e.g. Pigeon Pea (Tur), Gram"
            helperText="Helps in crop rotation calculations"
            error={errors.previous_crop?.message}
            {...register("previous_crop")}
          />
        </div>

        <Textarea
          label="Field Notes (Optional)"
          rows={3}
          maxLength={500}
          value={notesValue}
          placeholder="Add any specific observations, e.g. slope, drainage issues, salinity spots, nearby canal..."
          error={errors.notes?.message}
          {...register("notes")}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData.id ? "Update Farm Profile" : "Save Farm Profile"}
        </Button>
      </div>
    </form>
  );
}

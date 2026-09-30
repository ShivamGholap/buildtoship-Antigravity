import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { irrigationPlanFormSchema } from "../../../lib/schemas.js";
import { FarmSelect } from "../../farms/FarmSelect.jsx";
import { LanguageSelect } from "../LanguageSelect.jsx";
import { CropCombobox } from "../CropCombobox.jsx";
import { Select } from "../../ui/Select.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { useMeta } from "../../../hooks/useMeta.js";
import { Sparkles } from "lucide-react";

export function IrrigationPlanForm({
  farms = [],
  defaultFarmId,
  defaultLanguage = "en",
  onSubmit,
  loading = false,
}) {
  const { options } = useMeta();

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(irrigationPlanFormSchema),
    defaultValues: {
      farm_id: defaultFarmId || (farms.length > 0 ? farms[0].id : ""),
      language: defaultLanguage,
      crop: "",
      sowing_date: today,
      irrigation_method: "flood",
      water_hours_per_week: "",
      recent_rainfall_mm_7d: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Farm & Language Selection */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Farm Context
        </h3>

        <Controller
          name="farm_id"
          control={control}
          render={({ field }) => (
            <FarmSelect
              farms={farms}
              selectedFarmId={field.value}
              onChange={field.onChange}
              error={errors.farm_id?.message}
            />
          )}
        />

        <Controller
          name="language"
          control={control}
          render={({ field }) => (
            <LanguageSelect
              value={field.value}
              onChange={field.onChange}
              error={errors.language?.message}
            />
          )}
        />
      </div>

      {/* Crop & Sowing Timeline */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Crop & Irrigation Method
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="crop"
            control={control}
            render={({ field }) => (
              <CropCombobox
                catalog={options?.cropsCatalog || []}
                value={field.value}
                onChange={field.onChange}
                error={errors.crop?.message}
                required
              />
            )}
          />

          <Input
            label="Sowing / Planting Date"
            type="date"
            required
            error={errors.sowing_date?.message}
            {...register("sowing_date")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Irrigation Method"
            options={options?.irrigationMethods || []}
            required
            error={errors.irrigation_method?.message}
            {...register("irrigation_method")}
          />

          <Input
            label="Available Pumping Hours/Week (Optional)"
            type="number"
            placeholder="e.g. 14 (2 hrs/day electricity)"
            helperText="Electricity / canal availability"
            error={errors.water_hours_per_week?.message}
            {...register("water_hours_per_week")}
          />

          <Input
            label="Rainfall in Last 7 Days (mm, Optional)"
            type="number"
            placeholder="e.g. 25"
            helperText="Recent rain received in mm"
            error={errors.recent_rainfall_mm_7d?.message}
            {...register("recent_rainfall_mm_7d")}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={Sparkles}
          className="w-full sm:w-auto"
        >
          Generate Irrigation Schedule
        </Button>
      </div>
    </form>
  );
}

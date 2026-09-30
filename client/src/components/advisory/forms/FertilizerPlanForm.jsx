import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fertilizerPlanFormSchema } from "../../../lib/schemas.js";
import { FarmSelect } from "../../farms/FarmSelect.jsx";
import { LanguageSelect } from "../LanguageSelect.jsx";
import { CropCombobox } from "../CropCombobox.jsx";
import { Select } from "../../ui/Select.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { useMeta } from "../../../hooks/useMeta.js";
import { Sparkles, FileText } from "lucide-react";

export function FertilizerPlanForm({
  farms = [],
  defaultFarmId,
  defaultLanguage = "en",
  onSubmit,
  loading = false,
}) {
  const { options } = useMeta();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fertilizerPlanFormSchema),
    defaultValues: {
      farm_id: defaultFarmId || (farms.length > 0 ? farms[0].id : ""),
      language: defaultLanguage,
      crop: "",
      growth_stage: "sowing_germination",
      target_yield_note: "",
      soil_test_available: false,
      soil_n_kg_ha: "",
      soil_p_kg_ha: "",
      soil_k_kg_ha: "",
      preference: "integrated",
    },
  });

  const soilTestAvailable = watch("soil_test_available");

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

      {/* Crop & Growth Stage */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Target Crop & Strategy
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

          <Select
            label="Current Growth Stage"
            options={options?.growthStages || []}
            required
            error={errors.growth_stage?.message}
            {...register("growth_stage")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Nutrient Preference"
            options={options?.fertilizerPreferences || []}
            required
            error={errors.preference?.message}
            {...register("preference")}
          />

          <Input
            label="Target Yield Note (Optional)"
            placeholder="e.g. 25 quintals/acre, high yield hybrid"
            maxLength={120}
            error={errors.target_yield_note?.message}
            {...register("target_yield_note")}
          />
        </div>
      </div>

      {/* Soil Test Report Section */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-700" />
            Soil Test Health Card
          </h3>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 select-none">
            <input
              type="checkbox"
              className="w-4 h-4 text-brand-700 rounded border-stone-300 focus:ring-brand-700"
              {...register("soil_test_available")}
            />
            <span>I have recent soil test numbers</span>
          </label>
        </div>

        {soilTestAvailable ? (
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
            <p className="text-xs text-stone-600">
              Enter available soil test values in <strong>kg/ha</strong> (or leave blank if unknown):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Available Nitrogen (N kg/ha)"
                type="number"
                placeholder="e.g. 240"
                error={errors.soil_n_kg_ha?.message}
                {...register("soil_n_kg_ha")}
              />
              <Input
                label="Available Phosphorus (P kg/ha)"
                type="number"
                placeholder="e.g. 18"
                error={errors.soil_p_kg_ha?.message}
                {...register("soil_p_kg_ha")}
              />
              <Input
                label="Available Potassium (K kg/ha)"
                type="number"
                placeholder="e.g. 290"
                error={errors.soil_k_kg_ha?.message}
                {...register("soil_k_kg_ha")}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500 bg-amber-50/70 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
            No soil test card? No problem. The advisory will suggest university standard split doses tailored to your farm soil type ({options?.soilTypes?.find(s => s.value === watch("farm_id"))?.label || "selected soil"}), along with guidance on getting a soil health card.
          </p>
        )}
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
          Generate Fertilizer Schedule
        </Button>
      </div>
    </form>
  );
}

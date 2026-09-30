import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cropRecommendationFormSchema } from "../../../lib/schemas.js";
import { FarmSelect } from "../../farms/FarmSelect.jsx";
import { LanguageSelect } from "../LanguageSelect.jsx";
import { Select } from "../../ui/Select.jsx";
import { Input } from "../../ui/Input.jsx";
import { Textarea } from "../../ui/Textarea.jsx";
import { Button } from "../../ui/Button.jsx";
import { useMeta } from "../../../hooks/useMeta.js";
import { Sparkles } from "lucide-react";

export function CropRecommendationForm({
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
    resolver: zodResolver(cropRecommendationFormSchema),
    defaultValues: {
      farm_id: defaultFarmId || (farms.length > 0 ? farms[0].id : ""),
      language: defaultLanguage,
      season: "kharif",
      budget_level: "medium",
      goal: "max_profit",
      previous_crop: "",
      market_access: "local_mandi",
      notes: "",
    },
  });

  const notesValue = watch("notes");

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

      {/* Season, Goals & Budget */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Season & Strategic Goals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Season"
            options={options?.seasons || []}
            required
            error={errors.season?.message}
            {...register("season")}
          />

          <Select
            label="Investment Budget Level"
            options={options?.budgetLevels || []}
            required
            error={errors.budget_level?.message}
            {...register("budget_level")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Primary Farming Goal"
            options={options?.cropGoals || []}
            required
            error={errors.goal?.message}
            {...register("goal")}
          />

          <Select
            label="Market Access & Selling Channel"
            options={options?.marketAccess || []}
            required
            error={errors.market_access?.message}
            {...register("market_access")}
          />
        </div>

        <Input
          label="Previous Season Crop (Optional)"
          placeholder="e.g. Cotton, Soybean, Wheat (helps rotation)"
          error={errors.previous_crop?.message}
          {...register("previous_crop")}
        />

        <Textarea
          label="Additional Farmer Notes (Optional)"
          rows={3}
          maxLength={500}
          value={notesValue}
          placeholder="Any special constraints or preferences, e.g. interested in intercropping, labor shortage at harvest..."
          error={errors.notes?.message}
          {...register("notes")}
        />
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
          Generate Crop Recommendations
        </Button>
      </div>
    </form>
  );
}

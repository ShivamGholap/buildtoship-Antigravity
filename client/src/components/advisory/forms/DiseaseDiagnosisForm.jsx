import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diseaseDiagnosisFormSchema } from "../../../lib/schemas.js";
import { FarmSelect } from "../../farms/FarmSelect.jsx";
import { LanguageSelect } from "../LanguageSelect.jsx";
import { CropCombobox } from "../CropCombobox.jsx";
import { ChipMultiSelect } from "../ChipMultiSelect.jsx";
import { ImageUploader } from "../ImageUploader.jsx";
import { Select } from "../../ui/Select.jsx";
import { Input } from "../../ui/Input.jsx";
import { Textarea } from "../../ui/Textarea.jsx";
import { Button } from "../../ui/Button.jsx";
import { useMeta } from "../../../hooks/useMeta.js";
import { Sparkles } from "lucide-react";

export function DiseaseDiagnosisForm({
  farms = [],
  defaultFarmId,
  defaultLanguage = "en",
  onSubmit,
  loading = false,
}) {
  const { options } = useMeta();
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(diseaseDiagnosisFormSchema),
    defaultValues: {
      farm_id: defaultFarmId || (farms.length > 0 ? farms[0].id : ""),
      language: defaultLanguage,
      crop: "",
      growth_stage: "vegetative",
      symptoms: [],
      symptom_description: "",
      affected_area_percent: 10,
      days_since_first_seen: 3,
      recent_weather: "normal",
      recent_inputs: "",
    },
  });

  const symptomsValue = watch("symptoms");
  const descriptionValue = watch("symptom_description");

  const handleFormSubmit = (data) => {
    onSubmit(data, selectedFile);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

      {/* Crop & Affected Stage */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Crop & Growth Stage
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
      </div>

      {/* Observed Symptoms */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Observed Symptoms & Field Signals
        </h3>

        <ChipMultiSelect
          categories={options?.symptomCategories || {}}
          selectedChips={symptomsValue}
          onChange={(chips) => setValue("symptoms", chips, { shouldValidate: true })}
          error={errors.symptoms?.message}
        />

        <Textarea
          label="Detailed Symptom Description (Optional if chips selected)"
          rows={3}
          maxLength={1000}
          value={descriptionValue}
          placeholder="Describe pattern of attack (e.g. concentric rings on lower leaves, powdery mildew spreading on upper leaves, wilting despite moist soil)..."
          error={errors.symptom_description?.message}
          {...register("symptom_description")}
        />

        {/* Optional Image Upload */}
        <div className="pt-2 border-t border-stone-100">
          <ImageUploader
            file={selectedFile}
            onFileChange={setSelectedFile}
          />
        </div>
      </div>

      {/* Spread & Environmental Factors */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Spread & Recent Weather
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Affected Area (%)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 15"
            helperText="Percentage of field showing damage"
            required
            error={errors.affected_area_percent?.message}
            {...register("affected_area_percent")}
          />

          <Input
            label="Days Since First Seen"
            type="number"
            min="0"
            max="90"
            placeholder="e.g. 4"
            helperText="How fast is it spreading?"
            required
            error={errors.days_since_first_seen?.message}
            {...register("days_since_first_seen")}
          />

          <Select
            label="Recent Weather"
            options={options?.weatherConditions || []}
            required
            error={errors.recent_weather?.message}
            {...register("recent_weather")}
          />
        </div>

        <Input
          label="Recent Sprays or Fertilizers Used (Optional)"
          placeholder="e.g. Mancozeb spray 5 days ago, urea top-dressed last week"
          maxLength={300}
          error={errors.recent_inputs?.message}
          {...register("recent_inputs")}
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
          Diagnose Pest or Disease
        </Button>
      </div>
    </form>
  );
}

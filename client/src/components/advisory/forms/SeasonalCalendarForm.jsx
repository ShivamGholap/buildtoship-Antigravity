import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { seasonalCalendarFormSchema } from "../../../lib/schemas.js";
import { FarmSelect } from "../../farms/FarmSelect.jsx";
import { LanguageSelect } from "../LanguageSelect.jsx";
import { CropCombobox } from "../CropCombobox.jsx";
import { Select } from "../../ui/Select.jsx";
import { Input } from "../../ui/Input.jsx";
import { Button } from "../../ui/Button.jsx";
import { useMeta } from "../../../hooks/useMeta.js";
import { Sparkles } from "lucide-react";

const MONTHS_OPTIONS = [
  { value: "1", label: "January (पौष - माघ)" },
  { value: "2", label: "February (माघ - फाल्गुन)" },
  { value: "3", label: "March (फाल्गुन - चैत्र)" },
  { value: "4", label: "April (चैत्र - वैशाख)" },
  { value: "5", label: "May (वैशाख - ज्येष्ठ)" },
  { value: "6", label: "June (ज्येष्ठ - आषाढ़)" },
  { value: "7", label: "July (आषाढ़ - श्रावण)" },
  { value: "8", label: "August (श्रावण - भाद्रपद)" },
  { value: "9", label: "September (भाद्रपद - आश्विन)" },
  { value: "10", label: "October (आश्विन - कार्तिक)" },
  { value: "11", label: "November (कार्तिक - मार्गशीर्ष)" },
  { value: "12", label: "December (मार्गशीर्ष - पौष)" },
];

export function SeasonalCalendarForm({
  farms = [],
  defaultFarmId,
  defaultLanguage = "en",
  onSubmit,
  loading = false,
}) {
  const { options } = useMeta();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(seasonalCalendarFormSchema),
    defaultValues: {
      farm_id: defaultFarmId || (farms.length > 0 ? farms[0].id : ""),
      language: defaultLanguage,
      crop: "",
      sowing_month: String(currentMonth),
      variety_note: "",
      duration_days: "",
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

      {/* Crop & Sowing Month */}
      <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-stone-900 border-b border-stone-100 pb-2">
          Crop & Planned Sowing Month
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
            label="Sowing Month"
            options={MONTHS_OPTIONS}
            required
            error={errors.sowing_month?.message}
            {...register("sowing_month")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Variety / Hybrid Category (Optional)"
            placeholder="e.g. Desi variety, BT cotton, Early maturing hybrid"
            maxLength={80}
            error={errors.variety_note?.message}
            {...register("variety_note")}
          />

          <Input
            label="Estimated Crop Duration in Days (Optional)"
            type="number"
            placeholder="e.g. 120 (leave blank for regional default)"
            helperText="Typical duration for seed-to-harvest"
            error={errors.duration_days?.message}
            {...register("duration_days")}
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
          Generate Seasonal Crop Calendar
        </Button>
      </div>
    </form>
  );
}

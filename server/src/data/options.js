export const ADVISORY_TYPES = [
  { value: "crop_recommendation", label: "Crop Recommendation", description: "Best crops ranked for your farm, season, water, and budget" },
  { value: "disease_diagnosis", label: "Pest & Disease Diagnosis", description: "Identify plant health issues with IPM-first biological/chemical treatment" },
  { value: "fertilizer_plan", label: "Fertilizer & Nutrient Plan", description: "Stage-wise dosage schedules with organic and balanced inorganic options" },
  { value: "irrigation_plan", label: "Irrigation & Water Plan", description: "Growth-stage watering schedule and water-saving advice" },
  { value: "seasonal_calendar", label: "Seasonal Crop Calendar", description: "Month-by-month tasks from land preparation to harvest" }
];

export const SEASONS = [
  { value: "kharif", label: "Kharif (Monsoon: Jun - Oct)" },
  { value: "rabi", label: "Rabi (Winter: Nov - Mar)" },
  { value: "zaid", label: "Zaid (Summer: Mar - Jun)" },
  { value: "year_round", label: "Year-Round / Perennial" }
];

export const SOIL_TYPES = [
  { value: "black_cotton", label: "Black Cotton (Regur)" },
  { value: "red", label: "Red Soil" },
  { value: "alluvial", label: "Alluvial Soil" },
  { value: "laterite", label: "Laterite Soil" },
  { value: "sandy", label: "Sandy Soil" },
  { value: "loamy", label: "Loamy Soil" },
  { value: "clayey", label: "Clayey Soil" },
  { value: "saline_alkaline", label: "Saline / Alkaline Soil" },
  { value: "unknown", label: "Unknown / Not Tested" }
];

export const IRRIGATION_SOURCES = [
  { value: "rainfed", label: "Rainfed (Monsoon Dependent)" },
  { value: "borewell", label: "Borewell / Tube Well" },
  { value: "open_well", label: "Open Well" },
  { value: "canal", label: "Canal Water" },
  { value: "river_lift", label: "River / Stream Lift" },
  { value: "farm_pond", label: "Farm Pond / Water Harvesting" },
  { value: "drip_installed", label: "Drip Irrigation System" },
  { value: "sprinkler_installed", label: "Sprinkler Irrigation System" }
];

export const WATER_AVAILABILITY = [
  { value: "scarce", label: "Scarce (Severe limitation)" },
  { value: "limited", label: "Limited (Manage carefully)" },
  { value: "adequate", label: "Adequate (Standard requirements met)" },
  { value: "abundant", label: "Abundant (Year-round plentiful)" }
];

export const GROWTH_STAGES = [
  { value: "land_preparation", label: "Land Preparation" },
  { value: "sowing_germination", label: "Sowing & Germination" },
  { value: "seedling", label: "Seedling / Early Vegetative" },
  { value: "vegetative", label: "Active Vegetative Growth" },
  { value: "flowering", label: "Flowering & Pollination" },
  { value: "fruiting_grain_filling", label: "Fruiting / Grain Filling" },
  { value: "maturity_harvest", label: "Maturity & Harvest" },
  { value: "post_harvest", label: "Post-Harvest Handling" }
];

export const BUDGET_LEVELS = [
  { value: "low", label: "Low Budget (Cost-Sensitive)" },
  { value: "medium", label: "Medium Budget (Standard Inputs)" },
  { value: "high", label: "High Budget (Commercial / Intensive)" }
];

export const CROP_GOALS = [
  { value: "max_profit", label: "Maximize Profitability" },
  { value: "low_risk", label: "Minimize Climate & Market Risk" },
  { value: "low_water", label: "Conserve Water (Drought Tolerant)" },
  { value: "organic", label: "Organic / Natural Farming" },
  { value: "food_security", label: "Subsistence & Household Food Security" }
];

export const MARKET_ACCESS = [
  { value: "local_mandi", label: "Local Mandi / APMC Yard" },
  { value: "nearby_city", label: "Nearby City Wholesale Market" },
  { value: "contract_farming", label: "Contract Farming / FPO Buyer" },
  { value: "export_linked", label: "Export Linked / Processing Unit" },
  { value: "unknown", label: "Unknown / Unspecified" }
];

export const WEATHER_CONDITIONS = [
  { value: "hot_dry", label: "Hot & Dry" },
  { value: "hot_humid", label: "Hot & Humid" },
  { value: "cool_humid", label: "Cool & Humid" },
  { value: "heavy_rain", label: "Heavy Rain / Waterlogged" },
  { value: "drought", label: "Prolonged Dry Spell / Drought" },
  { value: "normal", label: "Normal Season Weather" }
];

export const FERTILIZER_PREFERENCES = [
  { value: "organic_only", label: "Organic Only (No Synthetics)" },
  { value: "integrated", label: "Integrated (Organic + Chemical Balance)" },
  { value: "chemical_ok", label: "Chemical / Conventional Optimal" }
];

export const IRRIGATION_METHODS = [
  { value: "drip", label: "Drip Irrigation" },
  { value: "sprinkler", label: "Sprinkler Irrigation" },
  { value: "furrow", label: "Furrow / Ridge Irrigation" },
  { value: "flood", label: "Surface Flood Irrigation" },
  { value: "manual", label: "Manual Hose / Basin" }
];

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" }
];

export const AREA_UNITS = [
  { value: "acre", label: "Acres (एकड़)" },
  { value: "hectare", label: "Hectares (हेक्टेयर)" }
];

export const CROPS_CATALOG = [
  // Cereals
  { name: "Rice (Paddy)", category: "Cereals" },
  { name: "Wheat", category: "Cereals" },
  { name: "Maize", category: "Cereals" },
  { name: "Jowar (Sorghum)", category: "Cereals" },
  { name: "Bajra (Pearl Millet)", category: "Cereals" },
  { name: "Ragi (Finger Millet)", category: "Cereals" },
  // Pulses
  { name: "Tur (Pigeon Pea)", category: "Pulses" },
  { name: "Chickpea (Gram)", category: "Pulses" },
  { name: "Moong (Green Gram)", category: "Pulses" },
  { name: "Urad (Black Gram)", category: "Pulses" },
  { name: "Masoor (Lentil)", category: "Pulses" },
  { name: "Soybean", category: "Pulses" },
  // Oilseeds
  { name: "Groundnut", category: "Oilseeds" },
  { name: "Sunflower", category: "Oilseeds" },
  { name: "Mustard", category: "Oilseeds" },
  { name: "Sesame", category: "Oilseeds" },
  { name: "Safflower", category: "Oilseeds" },
  // Cash crops
  { name: "Cotton", category: "Cash Crops" },
  { name: "Sugarcane", category: "Cash Crops" },
  { name: "Turmeric", category: "Cash Crops" },
  { name: "Tobacco", category: "Cash Crops" },
  // Vegetables
  { name: "Tomato", category: "Vegetables" },
  { name: "Onion", category: "Vegetables" },
  { name: "Potato", category: "Vegetables" },
  { name: "Brinjal (Eggplant)", category: "Vegetables" },
  { name: "Chilli", category: "Vegetables" },
  { name: "Okra (Bhindi)", category: "Vegetables" },
  { name: "Cabbage", category: "Vegetables" },
  { name: "Cauliflower", category: "Vegetables" },
  { name: "Cucumber", category: "Vegetables" },
  { name: "Bitter Gourd", category: "Vegetables" },
  // Fruits
  { name: "Banana", category: "Fruits" },
  { name: "Pomegranate", category: "Fruits" },
  { name: "Grapes", category: "Fruits" },
  { name: "Mango", category: "Fruits" },
  { name: "Orange", category: "Fruits" },
  { name: "Papaya", category: "Fruits" },
  { name: "Guava", category: "Fruits" },
  // Spices & Others
  { name: "Ginger", category: "Spices & Others" },
  { name: "Garlic", category: "Spices & Others" },
  { name: "Coriander", category: "Spices & Others" },
  { name: "Marigold", category: "Spices & Others" }
];

export const SYMPTOM_CATEGORIES = {
  leaf: [
    "yellowing",
    "brown spots",
    "white powdery coating",
    "curling",
    "wilting",
    "holes/chewed edges",
    "streaks/mosaic",
    "rust-colored pustules",
    "leaf drop"
  ],
  stem_root: [
    "stem rot",
    "root rot",
    "galls/knots",
    "lodging",
    "cankers/lesions",
    "gummy exudate"
  ],
  fruit_grain: [
    "rotting",
    "spots",
    "cracking",
    "premature drop",
    "shrivelled grain",
    "borer holes"
  ],
  whole_plant: [
    "stunted growth",
    "patchy field",
    "sudden collapse",
    "poor flowering"
  ],
  pests_visible: [
    "aphids",
    "whitefly",
    "thrips",
    "caterpillars",
    "mites",
    "stem borer",
    "fruit borer",
    "termites",
    "none seen"
  ]
};

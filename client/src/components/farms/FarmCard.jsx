import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/Card.jsx";
import { Button } from "../ui/Button.jsx";
import { Badge } from "../ui/Badge.jsx";
import { formatLandSize, capitalize } from "../../lib/formatters.js";
import {
  Trees,
  MapPin,
  Droplet,
  Mountain,
  Edit2,
  Trash2,
  Calendar,
  Layers
} from "lucide-react";

export function FarmCard({ farm, onDelete }) {
  return (
    <Card hover className="overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-stone-900 leading-tight">
                {farm.name}
              </h3>
              <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                {farm.district}, {farm.state}
              </p>
            </div>
          </div>
          <Badge variant="brand" className="shrink-0">
            {formatLandSize(farm.land_size, farm.land_unit)}
          </Badge>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 text-stone-600">
            <Mountain className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">
              Soil: <strong className="text-stone-800">{capitalize(farm.soil_type)}</strong>
              {farm.soil_ph && ` (pH ${farm.soil_ph})`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-600">
            <Droplet className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">
              Water: <strong className="text-stone-800">{capitalize(farm.water_availability)}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-600">
            <Layers className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="truncate">
              Source: <strong className="text-stone-800">{capitalize(farm.irrigation_source)}</strong>
            </span>
          </div>

          {farm.current_crop && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">
                Crop: <strong className="text-stone-800">{farm.current_crop}</strong>
              </span>
            </div>
          )}
        </div>

        {farm.notes && (
          <p className="mt-3 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg italic line-clamp-2 border border-stone-100">
            "{farm.notes}"
          </p>
        )}
      </CardContent>

      {/* Card actions */}
      <div className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-end gap-2">
        <Link to={`/farms/${farm.id}/edit`}>
          <Button variant="outline" size="sm" icon={Edit2}>
            Edit
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(farm)}
          aria-label={`Delete farm ${farm.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

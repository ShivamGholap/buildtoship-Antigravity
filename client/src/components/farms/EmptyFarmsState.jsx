import React from "react";
import { Link } from "react-router-dom";
import { Trees, PlusCircle } from "lucide-react";
import { Button } from "../ui/Button.jsx";

export function EmptyFarmsState() {
  return (
    <div className="text-center p-8 sm:p-12 bg-white rounded-xl border border-dashed border-stone-300 max-w-lg mx-auto">
      <div className="w-14 h-14 bg-brand-50 text-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Trees className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-1.5">No Farms Added Yet</h3>
      <p className="text-sm text-stone-500 mb-6 leading-relaxed">
        To receive accurate, grounded crop advisories, please register your farm profile with its soil type, land size, and irrigation access.
      </p>
      <Link to="/farms/new">
        <Button variant="primary" icon={PlusCircle}>
          Add Your First Farm
        </Button>
      </Link>
    </div>
  );
}

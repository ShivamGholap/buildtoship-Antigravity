import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/Button.jsx";
import { ConfirmDialog } from "../../ui/ConfirmDialog.jsx";
import { Printer, Copy, RotateCcw, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";

export function AdvisoryActions({ advisory, onDelete, deleting = false }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    try {
      const summaryText = [
        `KRISHIMITRA AI ADVISORY: ${advisory.title}`,
        `Farm: ${advisory.farm_snapshot?.name || "Farm"} (${advisory.farm_snapshot?.district}, ${advisory.farm_snapshot?.state})`,
        `Type: ${advisory.type}`,
        `Date: ${new Date(advisory.created_at).toLocaleDateString()}`,
        "--------------------------------------------------",
        JSON.stringify(advisory.result, null, 2),
        "--------------------------------------------------",
        `Disclaimer: ${advisory.result?.disclaimer || "Please verify with local KVK before chemical use."}`
      ].join("\n\n");

      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      toast.success("Advisory text copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleRegenerate = () => {
    const route = `/advisory/${advisory.type.replace(/_/g, "-")}`;
    navigate(route, { state: { prefillInput: advisory.input, prefillFarmId: advisory.farm_id } });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-2.5 advisory-actions-bar no-print">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
          Print Advisory
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={copied ? Check : Copy}
          onClick={handleCopyText}
        >
          {copied ? "Copied!" : "Copy as Text"}
        </Button>
        <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleRegenerate}>
          Regenerate
        </Button>
      </div>

      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          icon={Trash2}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
        </Button>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          setShowDeleteConfirm(false);
          await onDelete();
        }}
        loading={deleting}
        title="Delete Advisory"
        message="Are you sure you want to delete this advisory and its chat history? This action cannot be reversed."
      />
    </div>
  );
}

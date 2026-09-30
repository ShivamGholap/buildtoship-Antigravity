import React from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action? This cannot be undone.",
  confirmText = "Delete",
  confirmVariant = "danger",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start space-x-3 mb-6">
        <div className="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-stone-600 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

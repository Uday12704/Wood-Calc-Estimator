import {
  CheckCircle2,
  Download,
  Save,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface EstimateActionsProps {
  onSaveDraft: () => void;
  onConfirm: () => void;
  onShare: () => void;
  onPrintExport: () => void;
  isSaving?: boolean;
}

export function EstimateActions({
  onSaveDraft,
  onConfirm,
  onShare,
  onPrintExport,
  isSaving = false,
}: EstimateActionsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">

      {/* LEFT */}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="cursor-pointer"
        >
          <Save className="mr-2 size-4" />
          Save as Draft
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          disabled={isSaving}
          className="cursor-pointer"
        >
          <CheckCircle2 className="mr-2 size-4" />
          Mark as Confirmed
        </Button>
      </div>

      {/* RIGHT */}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onShare}
          className="cursor-pointer"
        >
          <Share2 className="mr-2 size-4" />
          Share
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onPrintExport}
          className="cursor-pointer"
        >
          <Download className="mr-2 size-4" />
          Print / Export
        </Button>
      </div>

    </div>
  );
}
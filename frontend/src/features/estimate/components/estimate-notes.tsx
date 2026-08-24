import { Textarea } from "@/components/ui/textarea";

interface EstimateNotesProps {
  value: string;
  onChange: (value: string) => void;
}

export function EstimateNotes({
  value,
  onChange,
}: EstimateNotesProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Notes
        </h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Add any additional information or
          instructions for this estimate.
        </p>
      </div>

      <Textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Enter notes for this estimate..."
        className="mt-4 min-h-28 resize-y"
      />
    </div>
  );
}
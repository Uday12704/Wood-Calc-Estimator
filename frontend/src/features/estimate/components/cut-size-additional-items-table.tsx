import { useRef, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { CutSizeAdditionalItem } from "../types";
import { calculateAdditionalItem, calculateAdditionalItemsSubtotal } from "../utils/additional-item-calculations";

interface AdditionalItemsTableProps {
  items: CutSizeAdditionalItem[];
  onChange: (items: CutSizeAdditionalItem[]) => void;

  additionalGstEnabled: boolean;
  additionalGstRate: number;

  onAdditionalGstEnabledChange: (
    enabled: boolean,
  ) => void;

  onAdditionalGstRateChange: (
    rate: number,
  ) => void;
}

function createEmptyItem(): CutSizeAdditionalItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    pricePerUnit: "",
    quantity: 1,
    note: "",
    lineTotal: 0,
  };
}

export function AdditionalItemsTable({
  items,
  onChange,
  additionalGstEnabled,
  additionalGstRate,

  onAdditionalGstEnabledChange,
  onAdditionalGstRateChange,
}: AdditionalItemsTableProps) {
  const inputRefs =
    useRef<
      Record<string, HTMLInputElement | null>
    >({});

  const [activeNoteId, setActiveNoteId] =
      useState<string | null>(null);

  function setInputRef(
    id: string,
    element: HTMLInputElement | null,
  ) {
    inputRefs.current[id] = element;
  }

  function updateItem(
    id: string,
    field:
      | "description"
      | "pricePerUnit"
      | "quantity"
      | "note",
    value: string | number,
  ) {
    const updatedItems =
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        const calculation =
          calculateAdditionalItem(
            updatedItem.pricePerUnit,
            updatedItem.quantity,
          );

        return {
          ...updatedItem,
          ...calculation,
        };
      });

    onChange(updatedItems);
  }

  function addRow() {
    const newItem =
      createEmptyItem();

    onChange([
      ...items,
      newItem,
    ]);

    requestAnimationFrame(() => {
      inputRefs.current[
        `${newItem.id}-description`
      ]?.focus();
    });
  }

  function deleteRow(id: string) {
    if (items.length === 1) {
      onChange([
        createEmptyItem(),
      ]);
      return;
    }

    onChange(
      items.filter(
        (item) =>
          item.id !== id,
      ),
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    itemId: string,
    field:
      | "description"
      | "pricePerUnit"
      | "quantity",
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const currentIndex =
      items.findIndex(
        (item) =>
          item.id === itemId,
      );

    if (
      field === "quantity" &&
      currentIndex ===
        items.length - 1
    ) {
      addRow();
      return;
    }

    const fieldOrder = [
      "description",
      "pricePerUnit",
      "quantity",
    ] as const;

    const fieldIndex =
      fieldOrder.indexOf(field);

    const nextField =
      fieldOrder[fieldIndex + 1];

    if (!nextField) {
      return;
    }

    inputRefs.current[
      `${itemId}-${nextField}`
    ]?.focus();
  }

  function getNotePreview(note: string) {
    if (!note.trim()) {
      return "Add note";
    }

    const trimmed = note.trim();

    if (trimmed.length <= 12) {
      return trimmed;
    }

    return `${trimmed.slice(0, 12)}...`;
  }

  const additionalSubtotal =
    calculateAdditionalItemsSubtotal(
      items,
    );

  const additionalGstAmount =
    additionalGstEnabled
      ? (additionalSubtotal *
          additionalGstRate) /
        100
      : 0;

  const additionalTotal =
    additionalSubtotal +
    additionalGstAmount;

  return (
    <div className="border rounded-lg bg-background">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">
          Additional Items
        </h3>

        <p className="text-sm text-muted-foreground">
          Add additional products or services.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-3 py-3 text-left">
                #
              </th>

              <th className="px-3 py-3 text-left">
                Description
              </th>

              <th className="px-3 py-3 text-right">
                Price / Unit
              </th>

              <th className="px-3 py-3 text-right">
                Qty
              </th>

              <th className="px-3 py-3 text-right">
                Notes
              </th>

              <th className="px-3 py-3 text-right">
                Line Total
              </th>

              <th className="px-3 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map(
              (item, index) => (
                <tr key={item.id}>
                  <td className="px-3 py-2">
                    {index + 1}
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      ref={(element) =>
                        setInputRef(
                          `${item.id}-description`,
                          element,
                        )
                      }
                      value={
                        item.description
                      }
                      placeholder="Description"
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "description",
                          event.target.value,
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          event,
                          item.id,
                          "description",
                        )
                      }
                      className="h-9"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      ref={(element) =>
                        setInputRef(
                          `${item.id}-pricePerUnit`,
                          element,
                        )
                      }
                      type="number"
                      min="0"
                      value={
                        item.pricePerUnit
                      }
                      placeholder="0"
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "pricePerUnit",
                          event.target.value === ""
                            ? ""
                            : Number(
                                event.target.value,
                              ),
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          event,
                          item.id,
                          "pricePerUnit",
                        )
                      }
                      className="h-9 text-right"
                    />
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      ref={(element) =>
                        setInputRef(
                          `${item.id}-quantity`,
                          element,
                        )
                      }
                      type="number"
                      min="1"
                      value={
                        item.quantity
                      }
                      onChange={(event) =>
                        updateItem(
                          item.id,
                          "quantity",
                          event.target.value === ""
                            ? ""
                            : Number(
                                event.target.value,
                              ),
                        )
                      }
                      onKeyDown={(event) =>
                        handleKeyDown(
                          event,
                          item.id,
                          "quantity",
                        )
                      }
                      className="h-9 text-right"
                    />
                  </td>

                  {/* NOTES */}

                    <td className="px-2 py-2">

                      {activeNoteId === item.id ? (
                        <Input
                          ref={(element) =>
                            setInputRef(
                              `${item.id}-note`,
                              element,
                            )
                          }
                          value={item.note}
                          placeholder="Add note..."
                          onChange={(event) =>
                            updateItem(
                              item.id,
                              "note",
                              event.target.value,
                            )
                          }
                          onBlur={() =>
                            setActiveNoteId(null)
                          }
                          className="h-9"
                          autoFocus
                        />
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setActiveNoteId(item.id)
                          }
                          className="max-w-28 cursor-pointer justify-start overflow-hidden text-muted-foreground"
                          title={item.note || "Add note"}
                        >
                          <MessageSquare className="mr-1 size-4 shrink-0" />

                          <span className="truncate">
                            {getNotePreview(item.note)}
                          </span>
                        </Button>
                      )}

                    </td>

                  <td className="px-3 py-2 text-right font-medium">
                    ₹
                    {item.lineTotal.toFixed(
                      2,
                    )}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        deleteRow(
                          item.id,
                        )
                      }
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t px-4 py-3">
        <Button
          type="button"
          variant="ghost"
          onClick={addRow}
        >
          + Add Row
        </Button>
      </div>

      <div className="border-t p-4 space-y-4">

      {/* ADDITIONAL GST */}

      <div className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={additionalGstEnabled}
          onChange={(event) =>
            onAdditionalGstEnabledChange(
              event.target.checked,
            )
          }
          className="size-4"
        />

        <span className="text-sm font-medium">
          Enable GST
        </span>

        {additionalGstEnabled && (
          <>
            <Input
              type="number"
              min="0"
              max="100"
              value={additionalGstRate}
              onChange={(event) =>
                onAdditionalGstRateChange(
                  Number(
                    event.target.value,
                  ),
                )
              }
              className="h-9 w-24"
            />

            <span className="text-sm">
              %
            </span>
          </>
        )}

      </div>


      {/* ADDITIONAL TOTALS */}

      <div className="ml-auto w-full max-w-sm space-y-2 text-sm">

        <div className="flex justify-between">
          <span>
            Additional Subtotal
          </span>

          <span className="font-medium">
            Rs.{" "}
            {additionalSubtotal.toFixed(2)}
          </span>
        </div>


        {additionalGstEnabled && (
          <div className="flex justify-between">
            <span>
              GST ({additionalGstRate}%)
            </span>

            <span>
              Rs.{" "}
              {additionalGstAmount.toFixed(2)}
            </span>
          </div>
        )}


        <div className="border-t pt-2" />

        <div className="flex justify-between text-base font-semibold">
          <span>
            Additional Total
          </span>

          <span>
            Rs.{" "}
            {additionalTotal.toFixed(2)}
          </span>
        </div>

      </div>

    </div>

    </div>
  );
}
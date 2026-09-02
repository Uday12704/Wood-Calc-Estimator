import {
  useRef,
  useState,
} from "react";

import {
  Trash2,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type {
  CustomEstimateItem,
} from "../types";

import { calculateCustomItem } from "../utils/custom-estimate-calculations";

interface CustomItemsTableProps {
  items: CustomEstimateItem[];
  onChange: (items: CustomEstimateItem[]) => void;
}

function createEmptyItem(): CustomEstimateItem {
  return {
    id: crypto.randomUUID(),
    description: "",
    pricePerUnit: "",
    quantity: 1,
    note: "",
    lineTotal: 0,
  };
}

export function CustomItemsTable({
  items,
  onChange,
}: CustomItemsTableProps) {
  const inputRefs =
    useRef<Record<string, HTMLInputElement | null>>(
      {},
    );

  const [activeNoteId, setActiveNoteId] =
    useState<string | null>(null);

  function addRow() {
    const newItem = createEmptyItem();

    onChange([
      ...items,
      newItem,
    ]);

    setTimeout(() => {
      inputRefs.current[
        `${newItem.id}-description`
      ]?.focus();
    }, 0);
  }

  function deleteRow(id: string) {
    if (items.length === 1) {
      onChange([createEmptyItem()]);
      return;
    }

    onChange(
      items.filter(
        (item) => item.id !== id,
      ),
    );
  }

  function updateItem(
    id: string,
    field: keyof CustomEstimateItem,
    value: string | number,
  ) {
    const updatedItems = items.map(
      (item) => {
        if (item.id !== id) {
          return item;
        }

        const updatedItem = {
          ...item,
          [field]: value,
        };

        const calculation =
          calculateCustomItem({
            quantity:
              updatedItem.quantity,
            pricePerUnit:
              updatedItem.pricePerUnit,
          });

        return {
          ...updatedItem,
          ...calculation,
        };
      },
    );

    onChange(updatedItems);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<
      HTMLInputElement | HTMLSelectElement
    >,
    itemId: string,
    field: keyof CustomEstimateItem,
  ) {
    /*
    * TAB
    *
    * When Tab is pressed from Quantity,
    * create a new row and focus its Breadth.
    */
    if (
      event.key === "Tab" &&
      field === "quantity"
    ) {
      event.preventDefault();

      const currentIndex = items.findIndex(
        (item) => item.id === itemId,
      );

      if (
        currentIndex ===
        items.length - 1
      ) {
        /* const currentItem =
          items[currentIndex];

        const calculation =
          calculateCustomItem({
            quantity: currentItem.quantity,
            pricePerUnit: currentItem.pricePerUnit,
          }); */

        const newItem: CustomEstimateItem = {
          id: crypto.randomUUID(),

          description: "",
          pricePerUnit: "",

          quantity: 1,
          note: "",
          lineTotal: 0,
        };

        onChange([
          ...items,
          newItem,
        ]);

        /*
        * Wait until React renders the
        * new row before focusing it.
        */
        requestAnimationFrame(() => {
          inputRefs.current[
            `${newItem.id}-description`
          ]?.focus();
        });

        return;
      }

      const nextItem =
        items[currentIndex + 1];

      inputRefs.current[
        `${nextItem.id}-description`
      ]?.focus();

      return;
    }

    /*
    * Everything below this point is
    * your existing ENTER behavior.
    */

    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();

    const currentIndex =
      items.findIndex(
        (item) => item.id === itemId,
      );

    /*
    * Enter from Notes or Quantity:
    * create the next row if this is
    * the last row.
    */
    if (
      field === "note" ||
      field === "quantity"
    ) {
      if (
        currentIndex ===
        items.length - 1
      ) {
        addRow();
        return;
      }

      const nextItem =
        items[currentIndex + 1];

      inputRefs.current[
        `${nextItem.id}-description`
      ]?.focus();

      return;
    }

    /*
    * For other fields, move to the
    * next logical input.
    */
    const fieldOrder: (
      keyof CustomEstimateItem
    )[] = [
      "description",
      "pricePerUnit",
      "quantity",
      "note",
      "lineTotal",
    ];

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

  function setInputRef(
    id: string,
    element: HTMLInputElement | null,
  ) {
    inputRefs.current[id] = element;
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

  return (
    <div className="overflow-hidden rounded-lg border bg-muted/30">

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-muted/70">

              <th className="w-10 border-b px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                />
              </th>

              <th className="w-10 border-b px-3 py-3 text-left text-xs font-semibold">
                #
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                DESCRIPTION
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                PRICE / UNIT
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                QTY
              </th>

              <th className="min-w-[150px] border-b px-3 py-3 text-left text-xs font-semibold">
                NOTES
              </th>

              <th className="border-b px-3 py-3 text-right text-xs font-semibold">
                LINE TOTAL
              </th>

              <th className="border-b px-3 py-3 text-center text-xs font-semibold">
                ACTIONS
              </th>

            </tr>
          </thead>

          <tbody className="bg-muted/30">

            {items.map(
              (item, index) => {
                
                return (
                  <tr
                    key={item.id}
                    className="border-b last:border-b-0"
                  >

                    {/* CHECKBOX */}

                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${
                          index + 1
                        }`}
                      />
                    </td>

                    {/* NUMBER */}

                    <td className="px-3 py-3 text-sm">
                      {index + 1}
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-2 py-2">
                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-description`,
                            element,
                          )
                        }
                        type="text"
                        value={item.description}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "description",
                            event.target.value,
                          )
                        }
                      />
                    </td>

                    {/* PRICE */}

                    <td className="px-2 py-2">

                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-pricePerUnit`,
                            element,
                          )
                        }
                        type="number"
                        min="0"
                        step="any"
                        value={
                          item.pricePerUnit
                        }
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "pricePerUnit",
                            event.target
                              .value === ""
                              ? ""
                              : Number(
                                  event.target
                                    .value,
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
                        className="h-9 min-w-[110px]"
                        placeholder={
                            "₹ / unit"
                        }
                      />

                    </td>

                    {/* QUANTITY */}

                    <td className="px-2 py-2">

                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-quantity`,
                            element,
                          )
                        }
                        type="number"
                        min="1"
                        step="1"
                        value={
                          item.quantity
                        }
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "quantity",
                            event.target
                              .value === ""
                              ? ""
                              : Number(
                                  event.target
                                    .value,
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
                        className="h-9 min-w-[70px]"
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
                          onKeyDown={(event) =>
                            handleKeyDown(
                              event,
                              item.id,
                              "note",
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

                    {/* LINE TOTAL */}

                    <td className="px-3 py-3 text-right text-sm font-semibold">

                      ₹
                      {item.lineTotal.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}

                    </td>

                    {/* ACTIONS */}

                    <td className="px-2 py-3">

                      <div className="flex justify-center">

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive cursor-pointer"
                          onClick={() =>
                            deleteRow(
                              item.id,
                            )
                          }
                          title="Delete row"
                        >
                          <Trash2 className="size-4" />
                        </Button>

                      </div>

                    </td>

                  </tr>
                );
              },
            )}

          </tbody>

        </table>

      </div>

      {/* ADD ROW */}

      <button
        type="button"
        onClick={addRow}
        className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-primary hover:bg-muted/50 cursor-pointer"
      >
        <span className="text-lg">
          +
        </span>

        Add Row
      </button>

    </div>
  );
}
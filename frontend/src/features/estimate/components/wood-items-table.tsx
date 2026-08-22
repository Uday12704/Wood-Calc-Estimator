import {
  useEffect,
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
  WoodItem,
  WoodCategory,
} from "../types";

import { calculateWoodItem } from "../utils/wood-calculations";

interface WoodItemsTableProps {
  items: WoodItem[];
  categories: WoodCategory[];
  onChange: (items: WoodItem[]) => void;
}

function createEmptyItem(): WoodItem {
  return {
    id: crypto.randomUUID(),

    breadth: "",
    height: "",

    woodType: "",

    pricePerUnit: "",

    length: "",
    quantity: 1,

    note: "",

    totalCft: 0,
    lineTotal: 0,
  };
}

export function WoodItemsTable({
  items,
  categories,
  onChange,
}: WoodItemsTableProps) {
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
        `${newItem.id}-breadth`
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
    field: keyof WoodItem,
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

        const selectedCategory =
          categories.find(
            (category) =>
              category.name ===
              updatedItem.woodType,
          );

        const calculation =
          calculateWoodItem({
            breadth:
              updatedItem.breadth,
            height:
              updatedItem.height,
            length:
              updatedItem.length,
            quantity:
              updatedItem.quantity,
            pricePerUnit:
              updatedItem.pricePerUnit,
            calculationMode:
              selectedCategory
                ?.calculationMode ?? "CFT",
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
    event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
    itemId: string,
    field: keyof WoodItem,
  ) {
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
        `${nextItem.id}-breadth`
      ]?.focus();

      return;
    }

    /*
     * For other fields, move to the
     * next logical input.
     */

    const fieldOrder: (
      keyof WoodItem
    )[] = [
      "breadth",
      "height",
      "woodType",
      "pricePerUnit",
      "length",
      "quantity",
      "note",
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
                BREADTH (IN)
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                HEIGHT (IN)
              </th>

              <th className="min-w-[180px] border-b px-3 py-3 text-left text-xs font-semibold">
                WOOD TYPE
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                PRICE / UNIT
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                LENGTH (FT)
              </th>

              <th className="border-b px-3 py-3 text-left text-xs font-semibold">
                QTY
              </th>

              <th className="min-w-[150px] border-b px-3 py-3 text-left text-xs font-semibold">
                NOTES
              </th>

              <th className="border-b px-3 py-3 text-right text-xs font-semibold">
                TOTAL
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
                const category =
                  categories.find(
                    (category) =>
                      category.name ===
                      item.woodType,
                  );

                const unitLabel =
                  category
                    ?.calculationMode ===
                  "SQFT"
                    ? "₹ / SqFt"
                    : "₹ / CFT";

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

                    {/* BREADTH */}

                    <td className="px-2 py-2">
                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-breadth`,
                            element,
                          )
                        }
                        type="number"
                        min="0"
                        step="any"
                        value={item.breadth}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "breadth",
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
                            "breadth",
                          )
                        }
                        className="h-9 min-w-[85px]"
                      />
                    </td>

                    {/* HEIGHT */}

                    <td className="px-2 py-2">
                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-height`,
                            element,
                          )
                        }
                        type="number"
                        min="0"
                        step="any"
                        value={item.height}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "height",
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
                            "height",
                          )
                        }
                        className="h-9 min-w-[85px]"
                      />
                    </td>

                    {/* WOOD TYPE */}

                    <td className="px-2 py-2">

                      <select
                        value={item.woodType}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "woodType",
                            event.target
                              .value,
                          )
                        }
                        onKeyDown={(event) =>
                          handleKeyDown(
                            event,
                            item.id,
                            "woodType",
                          )
                        }
                        className="h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >

                        <option value="">
                          Select wood
                        </option>

                        {categories.map(
                          (category) => (
                            <option
                              key={
                                category.id
                              }
                              value={
                                category.name
                              }
                            >
                              {
                                category.name
                              }
                            </option>
                          ),
                        )}

                      </select>

                      {category && (
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {category.calculationMode ===
                          "SQFT"
                            ? "SQFT MODE"
                            : "CFT MODE"}
                        </div>
                      )}

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
                          unitLabel
                        }
                      />

                    </td>

                    {/* LENGTH */}

                    <td className="px-2 py-2">

                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-length`,
                            element,
                          )
                        }
                        type="number"
                        min="0"
                        step="any"
                        value={item.length}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "length",
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
                            "length",
                          )
                        }
                        className="h-9 min-w-[90px]"
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

                      {activeNoteId ===
                      item.id ? (
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
                              event.target
                                .value,
                            )
                          }
                          onKeyDown={(
                            event,
                          ) =>
                            handleKeyDown(
                              event,
                              item.id,
                              "note",
                            )
                          }
                          onBlur={() =>
                            setActiveNoteId(
                              null,
                            )
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
                            setActiveNoteId(
                              item.id,
                            )
                          }
                          className="text-muted-foreground cursor-pointer"
                        >
                          <MessageSquare className="mr-1 size-4" />

                          {item.note
                            ? "Edit note"
                            : "Add note"}
                        </Button>
                      )}

                    </td>

                    {/* TOTAL */}

                    <td className="px-3 py-3 text-right text-sm font-medium">

                      {item.totalCft.toFixed(
                        2,
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
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
  RoundSizeItem,
  WoodCategory,
} from "../types";

import { calculateRoundSizeItem } from "../utils/round-size-calculations";

interface RoundSizeItemsTableProps {
  items: RoundSizeItem[];

  categories: WoodCategory[];

  cftEnabled: boolean;

  onCftEnabledChange: (
    enabled: boolean,
  ) => void;

  onChange: (
    items: RoundSizeItem[],
  ) => void;
}

function createEmptyRoundSizeItem(): RoundSizeItem {
  return {
    id: crypto.randomUUID(),
    woodType: "",
    logNo: "",
    length: "",
    girth: "",
    cbm: 0,
    cft: 0,
    note: "",
  };
}

export function RoundSizeItemsTable({
  items,
  categories,
  cftEnabled,
  onCftEnabledChange,
  onChange,
}: RoundSizeItemsTableProps) {
    const inputRefs =
        useRef<
        Record<
            string,
            HTMLInputElement | HTMLSelectElement | null
        >
        >({});
    
    const [ activeNoteId, setActiveNoteId, ] = useState<string | null>(null);

    function getNotePreview(
        note: string,
        ) {
        if (!note.trim()) {
            return "Add note";
        }

        const trimmed =
            note.trim();

        if (trimmed.length <= 12) {
            return trimmed;
        }

        return `${trimmed.slice(0, 12)}...`;
    }

    function updateItem(
        id: string,
        field: keyof RoundSizeItem,
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
            calculateRoundSizeItem({
                length:
                updatedItem.length,

                girth:
                updatedItem.girth,
            });

            return {
            ...updatedItem,
            ...calculation,
            };
        });

        onChange(updatedItems);
    }

    function addRow() {
        const newItem =
        createEmptyRoundSizeItem();

        onChange([
        ...items,
        newItem,
        ]);

        requestAnimationFrame(() => {
        inputRefs.current[
            `${newItem.id}-woodType`
        ]?.focus();
        });
    }

    function deleteRow(id: string) {
        if (items.length === 1) {
        onChange([
            createEmptyRoundSizeItem(),
        ]);

        return;
        }

        onChange(
        items.filter(
            (item) => item.id !== id,
        ),
        );
    }

    function setInputRef(
        id: string,
        element:
        | HTMLInputElement
        | HTMLSelectElement
        | null,
    ) {
        inputRefs.current[id] =
        element;
    }

    function addCopiedRow(
        currentItem: RoundSizeItem,
    ) {

        const newItem: RoundSizeItem = {
            id: crypto.randomUUID(),

            // Copy previous row values
            woodType:
            currentItem.woodType,
            logNo:"",
            length:"",
            girth:"",
            cbm:0,
            cft:0,
            note: "",
        };

        onChange([
            ...items,
            newItem,
        ]);

        requestAnimationFrame(() => {
            inputRefs.current[
            `${newItem.id}-logNo`
            ]?.focus();
        });
    }
    
    function handleKeyDown(
        event: React.KeyboardEvent<
        HTMLInputElement |
        HTMLSelectElement
        >,
        itemId: string,
        field:
        | "woodType"
        | "logNo"
        | "length"
        | "girth"
        | "note",
    ) {
        /*
        * TAB FROM GIRTH
        * -----------------------------
        */

        if (
        event.key === "Tab" &&
        field === "girth" &&
        !event.shiftKey
        ) {
            event.preventDefault();

            const currentIndex =
                items.findIndex(
                (item) => item.id === itemId,
                );

            const currentItem =
                items[currentIndex];

            if (!currentItem) {
                return;
            }

            /*
            * Last row
            */
            if (
                currentIndex ===
                items.length - 1
            ) {
                addCopiedRow(currentItem);
                return;
            }

            /*
            * Existing next row
            */
            const nextItem =
                items[currentIndex + 1];

            requestAnimationFrame(() => {
                inputRefs.current[
                `${nextItem.id}-logNo`
                ]?.focus();
            });

            return;
            }

        /*
        * ENTER
        * -----------------------------
        */

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
        field === "girth" ||
        field === "note"
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
            `${nextItem.id}-woodType`
        ]?.focus();

        return;
        }

        const fieldOrder = [
        "woodType",
        "logNo",
        "length",
        "girth",
        ] as const;

        const fieldIndex =
        fieldOrder.indexOf(field as any);

        const nextField =
        fieldOrder[fieldIndex + 1];

        if (!nextField) {
        return;
        }

        inputRefs.current[
        `${itemId}-${nextField}`
        ]?.focus();
    }

    return (
        <div className="overflow-x-auto rounded-lg border p-3">
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                    <input
                    type="checkbox"
                    checked={cftEnabled}
                    onChange={(event) =>
                        onCftEnabledChange(
                        event.target.checked,
                        )
                    }
                    />
                    Enable CFT
                </label>
            </div>

            <table className="w-full border-collapse">

              <thead>
                <tr className="bg-muted/70">

                    <th className="w-10 border-b px-3 py-3">
                        <input
                        type="checkbox"
                        aria-label="Select all rows"
                        />
                    </th>

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    #
                    </th>

                    <th className="min-w-[200px] border-b px-3 py-3 text-left font-semibold text-sm">
                    WOOD TYPE
                    </th>

                    <th className="min-w-[20px] border-b px-3 py-3 text-left font-semibold text-sm">
                    LOG NO
                    </th>

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    LENGTH (M)
                    </th>

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    GIRTH (CM)
                    </th>

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    CBM
                    </th>

                    {cftEnabled && (
                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                        CFT
                    </th>
                    )}

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    NOTES
                    </th>

                    <th className="border-b px-3 py-3 text-left font-semibold text-sm">
                    ACTIONS
                    </th>

                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
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

                    {/* WOOD TYPE */}

                    <td className="px-2 py-2">
                      <Input
                        ref={(element) =>
                          setInputRef(
                            `${item.id}-woodType`,
                            element,
                          )
                        }
                        type="text"
                        value={item.woodType}
                        onChange={(event) =>
                          updateItem(
                            item.id,
                            "woodType",
                            event.target.value,
                          )
                        }
                      />
                    </td>

                    <td className="px-2 py-2">
                        <Input
                        ref={(element) =>
                            setInputRef(
                            `${item.id}-logNo`,
                            element,
                            )
                        }
                        type="number"
                        step="any"
                        value={item.logNo}
                        onChange={(event) =>
                            updateItem(
                            item.id,
                            "logNo",
                            event.target.value,
                            )
                        }
                        onKeyDown={(event) =>
                            handleKeyDown(
                            event,
                            item.id,
                            "logNo",
                            )
                        }
                        placeholder="Log No"
                        className="h-9 min-w-[85px]"
                        />

                    </td>
                          
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
                        step="0.01"
                        value={item.length}
                        onChange={(event) =>
                            updateItem(
                            item.id,
                            "length",
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
                            "length",
                            )
                        }
                        className="h-9 text-left min-w-[85px]"
                        />

                    </td>

                    <td className="px-2 py-2">
                        <Input
                        ref={(element) =>
                            setInputRef(
                            `${item.id}-girth`,
                            element,
                            )
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.girth}
                        onChange={(event) =>
                            updateItem(
                            item.id,
                            "girth",
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
                            "girth",
                            )
                        }
                        className="h-9 text-left min-w-[85px]"
                        />

                    </td>
                    
                    <td className="px-3 py-2 text-right font-medium">
                        {item.cbm.toFixed(3)}
                    </td>

                    {cftEnabled && (
                    <td className="px-3 py-2 text-right font-medium">
                        {item.cft.toFixed(2)}
                    </td>
                    )}

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
                        autoFocus
                        className="h-9"
                        />
                    ) : (
                        <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            setActiveNoteId(item.id)
                        }
                        className="max-w-[120px] cursor-pointer justify-start text-muted-foreground"
                        >
                            <MessageSquare className="mr-1 size-4 shrink-0" />

                            <span className="truncate">
                                {getNotePreview(item.note)}
                            </span>
                        </Button>
                    )}
                    </td>

                    <td className="px-2 py-2">
                        <div className="flex items-center justify-center gap-1">

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() =>
                                deleteRow(item.id)
                                }
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
import { useEffect, useState } from "react";
import { Delete } from "lucide-react";

import { Button } from "@/components/ui/button";
import { evaluateExpression, replaceTrailingOperator } from "@/features/calculator/utils/calculator-utils";

interface HistoryItem {
  expression: string;
  result: string;
}

export default function NumericCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(
    [],
  );
  const [memory, setMemory] = useState(0);
  const [memoryRecalled, setMemoryRecalled] = useState(false);

  function getCurrentValue(): number {
    const currentValue = result || expression;

    if (!currentValue) {
      return 0;
    }

    const numericValue = Number(currentValue);

    return Number.isFinite(numericValue)
      ? numericValue
      : 0;
  }

  function memoryAdd() {
    let valueToStore = 0;

    if (result && result !== "Error") {
      valueToStore = Number(result);
    } 
    else if (expression.trim()) {
      try {
        const calculation = evaluateExpression(expression);

        valueToStore = Number(calculation.formatted);
        setResult(String(valueToStore));

      } catch {
        setResult("Error");
        return;
      }
    }

    if (!Number.isFinite(valueToStore)) {
      setResult("Error");
      return;
    }

    // Store the calculated value in memory.
    setMemory((current) => current + valueToStore);

    // Clear the expression and result after storing.
    setExpression("");
    setMemoryRecalled(false);
  }

  function memorySubtract() {
    const currentValue = getCurrentValue();

    setMemory((current) => current - currentValue);
    setMemoryRecalled(false);
  }

  function memoryRecallClear() {
    if (!memoryRecalled) {
      const formattedMemory =
        Number(memory.toFixed(10)).toString();

      setExpression(formattedMemory);
      setResult(formattedMemory);
      setMemoryRecalled(true);

      return;
    }

    setMemory(0);
    setMemoryRecalled(false);
  }

  function appendValue(value: string) {
    setExpression((current) =>
        replaceTrailingOperator(
        current,
        value,
        ),
    );

    setResult("");
    setMemoryRecalled(false);
    }

  function clearCalculator() {
    setExpression("");
    setResult("");
  }

  function clearCurrentEntry() {
    setExpression("");
    setResult("");
    setMemoryRecalled(false);
  }

  function backspace() {
    setExpression((current) =>
      current.slice(0, -1),
    );

    setResult("");
    setMemoryRecalled(false);
  }

  function calculate() {
    if (!expression.trim()) {
        return;
    }

    try {
        const calculation =
        evaluateExpression(expression);

        setResult(calculation.formatted);

        setHistory((current) => [
        {
            expression,
            result: calculation.formatted,
        },
        ...current,
        ].slice(0, 10));
    } catch {
        setResult("Error");
    }
    }

  useEffect(() => {
    function handleKeyboard(
      event: KeyboardEvent,
    ) {
      const key = event.key;

      if (
        /^[0-9.]$/.test(key)
      ) {
        appendValue(key);
        return;
      }

      if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "(" ||
        key === ")"
      ) {
        const displayOperator =
          key === "*"
            ? "x"
            : key === "/"
              ? "÷"
              : key === "-"
                ? "-"
                : key;

        appendValue(displayOperator);
        return;
      }

      if (key === "%") {
        appendValue("%");
        return;
      }

      if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
      }

      if (
        key === "Backspace"
      ) {
        backspace();
        return;
      }

      if (
        key === "Escape"
      ) {
        clearCalculator();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  });

  const buttons = [
    ["M+", "M-", "MRC", "⌫"],
    ["AC", "C", "(", ")"],
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "x"],
    ["1", "2", "3", "-"],
    ["0", ".", "%", "+"],
  ];

  return (
    <div className="space-y-5">
      {/* DISPLAY */}
      <div className="rounded-xl border bg-orange-100/30 p-4 text-right">
        <div className="min-h-6 break-all text-sm text-muted-foreground">
          {expression || "0"}
        </div>

        <div className="mt-2 min-h-10 break-all text-3xl font-semibold">
          {result || "0"}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map(
          (button, index) => {
            const isOperator =
              ["÷", "x", "-", "+"].includes(
                button,
              );

            const isAction =
              ["AC", "C", "⌫"].includes(
                button,
              );

            const isMemory =
              ["M+", "M-", "MRC"].includes(button);

            return (
              <Button
                key={`${button}-${index}`}
                type="button"
                variant={
                  isOperator
                    ? "default"
                    : isAction
                      ? "outline"
                      : "secondary"
                }
                className={
                  button === ""
                    ? "h-12 invisible"
                    : isMemory
                      ? "h-12 text-sm font-semibold bg-sidebar-accent cursor-pointer"
                      : isOperator
                        ? "h-12 text-base bg-wood-primary cursor-pointer dark:text-gray-50 text-xl"
                        : "h-12 text-base bg-sidebar-accent cursor-pointer"
                }
                onClick={() => {
                  if (button === "M+") {
                    memoryAdd();
                  } else if (button === "M-") {
                    memorySubtract();
                  } else if (button === "MRC") {
                    memoryRecallClear();
                  } else if (button === "") {
                    return;
                  } else if (button === "AC") {
                    clearCalculator();
                  } else if (button === "C") {
                    clearCurrentEntry();
                  } else if (button === "⌫") {
                    backspace();
                  } else {
                    appendValue(button);
                  }
                }}
              >
                {button === "⌫" ? (
                  <Delete className="size-4" />
                ) : (
                  button
                )}
              </Button>
            );
          },
        )}

        <Button
          type="button"
          className="col-span-4 h-12 text-xl font-semibold"
          onClick={calculate}
        >
          =
        </Button>
      </div>

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <h3 className="text-sm font-medium">
            Recent Calculations
          </h3>

          <div className="space-y-2">
            {history.map(
              (item, index) => (
                <button
                  key={`${item.expression}-${index}`}
                  type="button"
                  className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                  onClick={() => {
                    setExpression(
                      item.expression,
                    );
                    setResult(
                      item.result,
                    );
                  }}
                >
                  <p className="truncate text-sm text-muted-foreground">
                    {item.expression}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    = {item.result}
                  </p>
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
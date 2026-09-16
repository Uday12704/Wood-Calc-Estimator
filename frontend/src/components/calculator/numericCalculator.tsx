import { useEffect, useState } from "react";
import { Delete } from "lucide-react";

import { Button } from "@/components/ui/button";

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

  function appendValue(value: string) {
    setExpression((current) => {
        const operators = ["+", "-", "x", "÷"];

        const lastCharacter =
        current.slice(-1);

        // If the new value is an operator
        if (operators.includes(value)) {
        // If the expression already ends with
        // an operator, replace it.
        if (
            operators.includes(lastCharacter)
        ) {
            return (
            current.slice(0, -1) + value
            );
        }
        }

        return current + value;
    });

    setResult("");
    }

  function clearCalculator() {
    setExpression("");
    setResult("");
  }

  function backspace() {
    setExpression((current) => current.slice(0, -1));
    setResult("");
  }

  function calculate() {
    if (!expression.trim()) {
      return;
    }

    try {
      const sanitized = expression
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/-/g, "-")
        .replace(/%/g, "/100");

      if (
        !/^[0-9+\-*/().\s]+$/.test(
          sanitized,
        )
      ) {
        throw new Error("Invalid expression");
      }

      const tokens = sanitized.match(
        /(\d+(?:\.\d+)?|[+\-*/()])/g,
      );

      if (!tokens) {
        throw new Error("Invalid expression");
      }

      const values: number[] = [];
      const operators: string[] = [];

      const precedence = (operator: string) => {
        if (
          operator === "*" ||
          operator === "/"
        ) {
          return 2;
        }

        if (
          operator === "+" ||
          operator === "-"
        ) {
          return 1;
        }

        return 0;
      };

      const applyOperation = () => {
        const operator =
          operators.pop();

        const right = values.pop();
        const left = values.pop();

        if (
          operator === undefined ||
          left === undefined ||
          right === undefined
        ) {
          throw new Error(
            "Invalid expression",
          );
        }

        switch (operator) {
          case "+":
            values.push(left + right);
            break;

          case "-":
            values.push(left - right);
            break;

          case "*":
            values.push(left * right);
            break;

          case "/":
            if (right === 0) {
              throw new Error(
                "Cannot divide by zero",
              );
            }

            values.push(left / right);
            break;

          default:
            throw new Error(
              "Invalid operator",
            );
        }
      };

      for (const token of tokens) {
        if (!Number.isNaN(Number(token))) {
          values.push(Number(token));
          continue;
        }

        if (token === "(") {
          operators.push(token);
          continue;
        }

        if (token === ")") {
          while (
            operators.length > 0 &&
            operators[operators.length - 1] !==
              "("
          ) {
            applyOperation();
          }

          if (
            operators.pop() !== "("
          ) {
            throw new Error(
              "Invalid parentheses",
            );
          }

          continue;
        }

        while (
          operators.length > 0 &&
          operators[operators.length - 1] !==
            "(" &&
          precedence(
            operators[
              operators.length - 1
            ],
          ) >= precedence(token)
        ) {
          applyOperation();
        }

        operators.push(token);
      }

      while (operators.length > 0) {
        if (
          operators[operators.length - 1] ===
          "("
        ) {
          throw new Error(
            "Invalid parentheses",
          );
        }

        applyOperation();
      }

      if (values.length !== 1) {
        throw new Error(
          "Invalid expression",
        );
      }

      const calculatedValue =
        values[0];

      if (
        !Number.isFinite(
          calculatedValue,
        )
      ) {
        throw new Error(
          "Invalid result",
        );
      }

      const formattedResult =
        Number(
          calculatedValue.toFixed(10),
        ).toString();

      setResult(formattedResult);

      setHistory((current) => [
        {
          expression,
          result: formattedResult,
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
    ["AC", "(", ")", "⌫"],
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
              ["AC", "⌫"].includes(
                button,
              );

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
                className={isOperator ? "h-12 text-base bg-wood-primary cursor-pointer dark:text-gray-50 text-xl" : "h-12 text-base bg-sidebar-accent cursor-pointer"}
                onClick={() => {
                  if (button === "AC") {
                    clearCalculator();
                  } 
                  else if (button === "⌫") {
                    backspace();
                  } 
                  else if (button === "=") {
                    calculate();
                  } 
                  else {
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
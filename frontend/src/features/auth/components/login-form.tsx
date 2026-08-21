import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { LoginCredentials } from "../types";

interface LoginFormProps {
  onSubmit: (
    credentials: LoginCredentials,
  ) => Promise<void>;

  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error = null,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    onSubmit({
      email,
      password,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />

          <p>{error}</p>
        </div>
      )}
      {/* EMAIL */}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
        </Label>

        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          autoComplete="email"
          required
          disabled={isLoading}
        />
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">
            Password
          </Label>

          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
            onClick={() => {
              // Forgot password will be implemented later.
            }}
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <Input
            id="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="current-password"
            className="pr-10"
            required
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previous) => !previous,
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}

            <span className="sr-only">
              {showPassword
                ? "Hide password"
                : "Show password"}
            </span>
          </button>
        </div>
      </div>

      {/* LOGIN */}

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}

        {isLoading
          ? "Signing in..."
          : "Sign In"}
      </Button>
    </form>
  );
}
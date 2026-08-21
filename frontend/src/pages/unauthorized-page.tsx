import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">

      <div>
        <h1 className="text-4xl font-bold">
          403
        </h1>

        <h2 className="mt-2 text-xl font-semibold">
          Access Denied
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You don't have permission to access
          this page.
        </p>
      </div>

      <Button>
        <Link to="/app/dashboard">
          Back to Dashboard
        </Link>
      </Button>

    </div>
  );
}
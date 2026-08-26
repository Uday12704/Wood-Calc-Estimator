import {
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import type { EstimateType } from "../types";

interface EstimateTypeCardProps {
  type: EstimateType;
  title: string;
  description: string;
  image: string;
  onSelect: () => void;
}

export function EstimateTypeCard({
  title,
  description,
  image,
  onSelect,
}: EstimateTypeCardProps) {

  return (
    <Card className="group transition-all hover:-translate-y-0.5 hover:shadow-md">

      <CardHeader>

        <CardTitle className="text-lg font-semibold tracking-tight">
          {title}
        </CardTitle>

        <CardDescription className="leading-relaxed">
          {description}
        </CardDescription>

        <img
          src={image}
          alt={title}
          className="mx-auto mt-4 h-70 w-full object-contain"
        />

      </CardHeader>

      <CardContent>

        <Button
          type="button"
          className="w-full cursor-pointer"
          onClick={onSelect}
        >
          Create {title}

          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Button>

      </CardContent>

    </Card>
  );
}
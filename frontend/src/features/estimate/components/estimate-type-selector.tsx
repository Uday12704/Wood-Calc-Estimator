import { EstimateTypeCard } from "./estimate-type-card";
import type { EstimateType } from "../types";

import cutSizeImg from "../../../assets/cut-size.png";
import roundSizeImg from "../../../assets/round-size.png";
import customImg from "../../../assets/custom-image.png";

interface EstimateTypeSelectorProps {
  onSelect: (
    type: EstimateType,
  ) => void;
}

const estimateTypes = [
  {
    type: "CUT_SIZE" as const,
    title: "Cut Size",
    description:
      "Calculate wood using breadth, height, length and quantity.",
    image: cutSizeImg,
  },
  {
    type: "ROUND_SIZE" as const,
    title: "Round Size",
    description:
      "Calculate round wood and logs using the required measurements.",
    image: roundSizeImg,
  },
  {
    type: "CUSTOM" as const,
    title: "Custom Estimate",
    description:
      "Calculate custom estimates with your specific measurements.",
    image: customImg,
  },
];

export function EstimateTypeSelector({
  onSelect,
}: EstimateTypeSelectorProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-3">

      {estimateTypes.map((option) => (
        <EstimateTypeCard
          key={option.type}
          type={option.type}
          title={option.title}
          description={option.description}
          image={option.image}
          onSelect={() =>
            onSelect(option.type)
          }
        />
      ))}

    </div>
  );
}
import React from "react";
import { IconHoney, IconDry, IconSpicy } from "./Icon";

interface LevelIndicatorProps {
  icon: React.ElementType;
  label: string;
  level: number; // The level or count of indicators to display
  maxLevel?: number; // Maximum possible level (default to 4)
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  icon: Icon,
  label,
  level,
  maxLevel = 4,
}) => {
  return (
    <li className="text-left">
      <Icon size={35} />
      <div className="mt-2">{label}</div>
      <div className="flex mt-2">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={`h-1 w-6 mr-1 ${
              index < level ? "bg-black" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </li>
  );
};

const ProductLevelIndicator: React.FC<{ product: any }> = ({ product }) => {
  const { dryness_level, sweetness_level, heat_level } = product;
  const drynessLevel = dryness_level ? parseInt(dryness_level.value, 10) : 0;
  const sweetnessLevel = sweetness_level ? parseInt(sweetness_level.value, 10) : 0;
  const heatLevel = heat_level ? parseInt(heat_level.value, 10) : 0;

  const indicators = [
    { icon: IconSpicy, label: "Heat", level: heatLevel },
    { icon: IconDry, label: "Dryness", level: drynessLevel },
    { icon: IconHoney, label: "Sweetness", level: sweetnessLevel },
  ];

  return (
    <ul className="grid grid-cols-3 gap-4 list-none max-w-lg">
      {indicators.map(({ icon, label, level }, index) => (
        <LevelIndicator key={index} icon={icon} label={label} level={level} />
      ))}
    </ul>
  );
};

export default ProductLevelIndicator;

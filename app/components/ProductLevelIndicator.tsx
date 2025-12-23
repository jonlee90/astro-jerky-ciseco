import React from "react";
import { IconHoney, IconDry, IconSpicy } from "./Icon";

interface LevelIndicatorProps {
  icon: React.ElementType;
  label: string;
  level: number; // The level or count of indicators to display
  maxLevel?: number; // Maximum possible level (default to 4)
  size?: number; 
  levelClass?: string;
  labelClass?: string;
}

const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  icon: Icon,
  label,
  level,
  maxLevel = 3,
  size = 35,
  levelClass = "h-1 w-6 mr-1",
  labelClass = "text-base"
}) => {
  return (
    <li className="justify-items-center grid gap-1">
      <div className="text-center">
        <Icon size={size} />
        <div className={`mt-2 ${labelClass}`}>{label}</div>
      </div>
      <div className="flex flex-row">
        {Array.from({ length: maxLevel }).map((_, index) => (
          <div
            key={index}
            className={`${levelClass} ${
              index < level ? "bg-black" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </li>
  );
};

interface ProductLevelIndicatorProps {
  product: {
    dryness_level?: {value: string};
    sweetness_level?: {value: string};
    heat_level?: {value: string};
  };
  size?: number;
  levelClass?: string;
  labelClass?: string;
}

const ProductLevelIndicator: React.FC<ProductLevelIndicatorProps> = ({ product, size, levelClass, labelClass }) => {
  const { dryness_level, sweetness_level, heat_level } = product;
  const drynessLevel = dryness_level ? parseInt(dryness_level.value, 10) : 0;
  const sweetnessLevel = sweetness_level ? parseInt(sweetness_level.value, 10) : 0;
  const heatLevel = heat_level ? parseInt(heat_level.value, 10) : 0;

  const indicators = [
    { icon: IconSpicy, label: "Heat", level: heatLevel },
    { icon: IconDry, label: "Dry", level: drynessLevel },
    { icon: IconHoney, label: "Sweet", level: sweetnessLevel },
  ];

  return (
    <ul className="grid grid-cols-3 gap-4 list-none max-w-lg">
      {indicators.map(({ icon, label, level }, index) => (
        <LevelIndicator key={index} icon={icon} label={label} level={level} size={size} levelClass={levelClass} labelClass={labelClass} />
      ))}
    </ul>
  );
};

export default ProductLevelIndicator;

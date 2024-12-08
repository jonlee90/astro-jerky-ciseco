import React from "react";

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
      <Icon size={30} />
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

export default LevelIndicator;
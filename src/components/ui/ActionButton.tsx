// src/components/ui/ActionButton.tsx
import React from "react";
import { ActionButtonProps } from "../types/ActionButtonProps";

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  disabled = false,
  colorScheme = "primary",
}) => {
  let baseColor = "";

  if (colorScheme === "primary") {
    baseColor = "bg-primary-600 hover:bg-primary-700";
  } else if (colorScheme === "danger") {
    baseColor = "bg-red-600 hover:bg-red-700";
  } else if (colorScheme === "secondary") {
    baseColor = "bg-secondary-600 hover:bg-secondary-700";
  } else if (colorScheme === "success") {
    baseColor = "bg-green-600 hover:bg-green-700";
  } else if (colorScheme === "warning") {
    baseColor = "bg-yellow-600 hover:bg-yellow-700";
  } else if (colorScheme === "info") {
    baseColor = "bg-blue-600 hover:bg-blue-700";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg text-white ${baseColor}
                  disabled:opacity-50 disabled:cursor-not-allowed transition`}
    >
      {label}
    </button>
  );
};

export default ActionButton;

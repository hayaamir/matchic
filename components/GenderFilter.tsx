import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type GenderFilterProps = {
  value: "male" | "female" | undefined;
  onChange: Dispatch<SetStateAction<"male" | "female" | undefined>>;
};

export const GenderFilter = ({ value, onChange }: GenderFilterProps) => {
  const handleClick = (gender: "male" | "female") => {
    onChange(value === gender ? undefined : gender);
  };

  return (
    <div className="inline-flex gap-3 p-1.5 bg-white rounded-full shadow-sm border border-gray-100">
      <Button
        variant="ghost"
        onClick={() => handleClick("female")}
        className={cn(
          "rounded-full px-6 py-2.5 font-medium transition-all duration-300 ease-in-out",
          value === "female"
            ? "bg-gradient-to-r from-pink-50 to-rose-50 text-rose-700 shadow-md scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        נשים
      </Button>

      <Button
        variant="ghost"
        onClick={() => handleClick("male")}
        className={cn(
          "rounded-full px-6 py-2.5 font-medium transition-all duration-300 ease-in-out",
          value === "male"
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md scale-105"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        )}
      >
        גברים
      </Button>
    </div>
  );
};

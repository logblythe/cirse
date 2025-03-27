import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { useState } from "react";

type Props = Pick<CheckboxProps, "checked" | "onCheckedChange" | "disabled"> & {
  label: string;
};

export const FieldCheckbox = (props: Props) => {
  const { label, checked, onCheckedChange, disabled } = props;

  const [isChecked, setIsChecked] = useState(checked ?? false);

  return (
    <div className="flex flex-row space-x-2 items-center">
      <Checkbox
        disabled={props.disabled}
        checked={isChecked}
        onCheckedChange={(value) => {
          setIsChecked(value);
          onCheckedChange?.(value);
        }}
      />
      <span
        className={cn({
          "text-gray-400 cursor-not-allowed": disabled,
        })}
      >
        {label}
      </span>
    </div>
  );
};

import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxProps } from "@radix-ui/react-checkbox";
import { useState } from "react";

type Props = Pick<CheckboxProps, "checked" | "onCheckedChange"> & {
  label: string;
};

export const FieldCheckbox = (props: Props) => {
  const { label, checked, onCheckedChange } = props;

  const [isChecked, setIsChecked] = useState(checked ?? false);

  return (
    <div className="flex flex-row space-x-2 items-center">
      <Checkbox
        checked={isChecked}
        onCheckedChange={(value) => {
          setIsChecked(value);
          onCheckedChange?.(value);
        }}
      />
      <span>{label}</span>
    </div>
  );
};

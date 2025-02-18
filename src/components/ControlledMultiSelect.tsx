"use client";

import { useFormContext } from "react-hook-form";

import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelect } from "./ui/multi-select";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  items: { id: string; name: string }[];
  onChange?: (value: string[]) => void;
};

export function ControlledMultiSelect(props: Props) {
  const { name, label, placeholder, items, hint, onChange } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <MultiSelect
            options={items}
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            defaultValue={
              field.value && Array.isArray(field.value)
                ? field.value
                    .filter((value: any) => value !== 0)
                    .map((value: any) => value.toString())
                : []
            }
            placeholder={placeholder}
            variant={"secondary"}
          />
          {hint ? <FormDescription>{hint}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

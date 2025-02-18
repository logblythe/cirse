"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { HTMLInputTypeAttribute } from "react";
import { Switch } from "./ui/switch";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  type?: HTMLInputTypeAttribute;
  className?: string;
};

export function ControlledSwitch(props: Props) {
  const {
    label,
    placeholder,
    hint,
    name,
    type,
    defaultValue = "",
    className,
  } = props;

  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-end justify-between rounded-lg border shadow-sm space-x-4 pb-2 px-4",
            className
          )}
        >
          <div>
            <FormLabel>{label}</FormLabel>
            {hint ? <FormDescription>{hint}</FormDescription> : null}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

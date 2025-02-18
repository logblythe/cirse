"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function ControlledInput(props: Props) {
  const {
    label,
    placeholder,
    hint,
    name,
    type,
    defaultValue = "",
    disabled = false,
    autoFocus = false,
  } = props;

  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              disabled={disabled}
              placeholder={placeholder}
              {...field}
              type={type}
              value={field.value ?? ""}
              autoFocus={autoFocus}
            />
          </FormControl>
          {hint ? (
            <FormDescription>This is your public display name.</FormDescription>
          ) : null}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

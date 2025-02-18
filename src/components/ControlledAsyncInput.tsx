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
import { Loader2 } from "lucide-react";
import {
  ChangeEvent,
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
  type?: HTMLInputTypeAttribute;
  isLoading?: boolean;
  debounceFunction: (value: string) => boolean;
};

export function ControlledAsyncInput(props: Props) {
  const {
    label,
    placeholder,
    hint,
    name,
    type,
    isLoading,
    debounceFunction,
    defaultValue = "",
  } = props;

  const { control, setValue, setError, clearErrors } = useFormContext();

  const debounced = useDebouncedCallback((value) => {
    if (debounceFunction(value)) {
      setError(name, { message: "Name already taken" }, { shouldFocus: true });
    } else {
      clearErrors(name);
    }
  }, 500);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value);
    debounced(event.target.value);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder={placeholder}
                  {...field}
                  type={type}
                  onChange={handleChange}
                />
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
              </div>
            </FormControl>
            {hint ? <FormDescription>{hint}</FormDescription> : null}

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

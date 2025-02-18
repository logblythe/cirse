"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ChevronDown, LoaderCircle } from "lucide-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { TooltipWrapper } from "./TooltipWrapper";

type Props = {
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  items: { id: string; name: string }[];
  onChange?: (value: string) => void;
  isLoading?: boolean;
};

export function ControlledCombobox(props: Props) {
  const { name, label, placeholder, items, hint, onChange, isLoading } = props;

  const { control, setValue } = useFormContext();

  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  disabled={isLoading}
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between font-normal ",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                  ) : null}
                  <TooltipWrapper
                    content={
                      field.value
                        ? items.find((item) => item.id === field.value)?.name ??
                          ""
                        : placeholder ?? ""
                    }
                  >
                    <span className="flex-1 overflow-hidden text-left text-ellipsis">
                      {field.value
                        ? items.find((item) => item.id === field.value)?.name
                        : placeholder}
                    </span>
                  </TooltipWrapper>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() => {
                        setValue(name, item.id);
                        onChange?.(item.id);
                        setOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {hint ? <FormDescription>{hint}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

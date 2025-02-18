"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Choice } from "@/type/question-type";
import { RadioGroupProps } from "@radix-ui/react-radio-group";

type Props = {
  name: string;
  items: Choice[];
  label?: string;
} & RadioGroupProps;

export default function ControlledRadio({ name, items, label }: Props) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange([value])}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {items.map((item) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={item.id} />
                    </FormControl>
                    <FormLabel className="font-normal">{item.name}</FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

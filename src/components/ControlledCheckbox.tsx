"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Choice } from "@/type/question-type";
import { CheckboxProps } from "@radix-ui/react-checkbox";

type Props = {
  name: string;
  items: Choice[];
  label?: string;
  hint?: string;
} & CheckboxProps;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export function ControlledCheckbox(props: Props) {
  const { name, items, label, hint } = props;
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{label}</FormLabel>
            {hint ? <FormDescription>{hint}</FormDescription> : null}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value: string) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.name}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

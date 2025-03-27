import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  fromDate: z.string(),
});

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  isLoading: boolean;
  onSubmit: (values: FormValues) => void;
};

export const SessionFiltersForm = (props: Props) => {
  const { isLoading, onSubmit } = props;
  const form = useForm<FormValues>({
    defaultValues: {
      fromDate: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>From</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <span>{format(field.value, "PPP")}</span>
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <Calendar
                    className="w-auto pt-2 bg-white shadow-lg rounded-lg border border-gray-200"
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(value) => {
                      value
                        ? field.onChange(format(value, "yyyy-MM-dd"))
                        : field.onChange(value);
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row justify-end w-full px-2">
          <Button disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-4" />
            ) : null}
            Extract Sessions
          </Button>
        </div>
      </form>
    </Form>
  );
};

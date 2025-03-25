import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Portal } from "@/type/portal";
import { capitalizeInitial } from "@/utils/capitalize-initials";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Combine the two schemas
const FormSchema = z.record(z.array(z.string()));

type FormValues = z.infer<typeof FormSchema>;

type Props = {
  isLoading: boolean;
  onSubmit: (values: FormValues) => void;
};

export const PresentationFiltersForm = (props: Props) => {
  const { isLoading, onSubmit } = props;

  const searchParams = useSearchParams();

  const portalId = searchParams.get("portalId");

  const queryClient = useQueryClient();

  const portalDetails = queryClient.getQueryData<Portal>(["portals", portalId]);

  const extractionFilters = portalDetails?.presentationExtractFilters;

  const defaultValues: FormValues =
    extractionFilters?.reduce(
      (acc, filter) => ({ ...acc, [filter.name]: [] }),
      {}
    ) || {};

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {extractionFilters?.map((filter) => {
            return (
              <FormField
                key={`${filter.name}`}
                name={filter.name}
                render={({ field }) => {
                  return (
                    <div key={`${filter.name}`} className="space-y-2">
                      <label className="text-sm">
                        {capitalizeInitial(filter.name)}
                      </label>
                      <MultiSelect
                        options={filter.values.map((value) => ({
                          id: value,
                          name: value,
                        }))}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </div>
                  );
                }}
              />
            );
          })}
          <div className="flex flex-row justify-end w-full px-2">
            <Button disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-4" />
              ) : null}
              Extract Presentations
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

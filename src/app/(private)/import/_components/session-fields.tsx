import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Field } from "@/type/portal";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FieldCheckbox } from "./field-checkbox";

type Props = {
  scope: string;
  isPending?: boolean;
  fields: Field[];
  onUpdateFields: (fields: Field[]) => void;
};

export const FieldsUpdateCard = (props: Props) => {
  const { scope, isPending, fields, onUpdateFields } = props;

  const [localFields, setLocalFields] = useState(fields);

  return (
    <Card className="w-full">
      <CardContent className="text-sm py-4 space-y-8 flex flex-col">
        <div className="flex-1 space-y-8 ">
          <CardTitle>{scope} Fields</CardTitle>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-80">
            {fields?.map((field) => {
              return (
                <FieldCheckbox
                  key={field.id}
                  label={field.name}
                  checked={field.enabled}
                  onCheckedChange={(value) => {
                    setLocalFields((prev) => {
                      return prev.map((localField) => {
                        if (localField.id === field.id) {
                          return { ...localField, enabled: Boolean(value) };
                        }
                        return localField;
                      });
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-row justify-end">
          <Button
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              onUpdateFields(localFields);
            }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-4" />
            ) : null}
            Update {scope} Fields
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

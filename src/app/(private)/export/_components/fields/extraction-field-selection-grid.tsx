import { ExtractField } from "@/type/portal";
import { CheckedState } from "@radix-ui/react-checkbox";
import { FieldCheckbox } from "./field-checkbox";

type Props = {
  localFields: ExtractField[];
  onUpdateFields: (fields: ExtractField[]) => void;
};

export const ExtractionFieldSelectionGrid = (props: Props) => {
  const { localFields, onUpdateFields } = props;

  const handleCheckChange = (field: ExtractField, value: CheckedState) => {
    const updatedLocalFields = localFields.map((localField) => {
      if (localField.alias === field.alias) {
        return { ...localField, enabled: Boolean(value) };
      }
      return localField;
    });
    onUpdateFields(updatedLocalFields);
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex-1 space-y-8 text-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-80">
          {localFields?.map((field) => {
            return (
              <FieldCheckbox
                disabled={field.custom}
                key={`${field.name}-${field.alias}-${field.enabled}`}
                label={field.name}
                checked={field.enabled}
                onCheckedChange={(value) => {
                  handleCheckChange(field, value);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

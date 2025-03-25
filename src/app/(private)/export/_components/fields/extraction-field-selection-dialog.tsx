"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExtractField } from "@/type/portal";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { ExtractionFieldSelectionGrid } from "./extraction-field-selection-grid";
import { FieldCheckbox } from "./field-checkbox";

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  scope?: string;
  isPending?: boolean;
  onMutate: (fields: ExtractField[]) => void;
  fields: ExtractField[];
};

export default function ExtractionFieldSelectionDialog(props: DialogProps) {
  const { open, onOpenChange, isPending, scope, onMutate } = props;

  const [shouldSelectAll, setShouldSelectAll] = useState(
    props.fields.every(({ enabled }) => enabled)
  );

  const [localFields, setLocalFields] = useState(props.fields);

  React.useEffect(() => {
    setLocalFields(props.fields);
  }, [props.fields]);

  const handleModalClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] sm:min-w-full lg:min-w-[720px] h-2/3 flex flex-col"
        onClick={handleModalClick}
      >
        <DialogHeader>
          <DialogTitle>{scope} fields to export</DialogTitle>
          <DialogDescription>
            Select the fields here that you want to export. Click save when
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <ExtractionFieldSelectionGrid
            localFields={localFields}
            onUpdateFields={(fields) => {
              setLocalFields(fields);
              setShouldSelectAll(fields.every(({ enabled }) => enabled));
            }}
          />
        </div>
        <DialogFooter>
          <div className="flex flex-row justify-between w-full px-2">
            <FieldCheckbox
              key={`${shouldSelectAll}`}
              label="Select All"
              checked={shouldSelectAll}
              onCheckedChange={(value) => {
                setShouldSelectAll(Boolean(value));
                if (Boolean(value)) {
                  setLocalFields((prev) =>
                    prev.map((field) => ({ ...field, enabled: true }))
                  );
                } else {
                  setLocalFields((prev) =>
                    prev.map((field) => ({ ...field, enabled: false }))
                  );
                }
              }}
            />
            <Button
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                onMutate(localFields);
              }}
              className="w-24"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-4" />
              ) : null}
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

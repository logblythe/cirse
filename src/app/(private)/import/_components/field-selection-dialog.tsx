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
import { Field } from "@/type/portal";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { FieldSelectionGrid } from "./session-fields";

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  scope?: string;
  isPending?: boolean;
  onMutate: (fields: Field[]) => void;
  fields: Field[];
};

export default function FieldSelectionDialog(props: DialogProps) {
  const { open, onOpenChange, isPending, scope, onMutate, fields } = props;

  const [localFields, setLocalFields] = useState(fields);

  React.useEffect(() => {
    setLocalFields(fields);
  }, [fields]);

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
          <DialogTitle>{scope} custom fields</DialogTitle>
          <DialogDescription>
            Make changes to custom fields here. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <FieldSelectionGrid
            localFields={localFields}
            onUpdateFields={setLocalFields}
          />
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              onMutate(localFields);
            }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-4" />
            ) : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

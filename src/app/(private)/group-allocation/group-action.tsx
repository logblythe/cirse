"use client";

import { TooltipWrapper } from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, RefreshCcw, Trash2 } from "lucide-react";

const GroupAction = () => {
  return (
    <div className="flex flex-row space-x-4 items-center">
      <TooltipWrapper content={"Sync"}>
        <Button
          variant="outline"
          size="icon"
          className="text-green-500"
          onClick={(e) => {}}
        >
          <RefreshCcw className={cn("h-4 w-4")} />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content={"View Payment"}>
        <Button
          variant="outline"
          size="icon"
          className="text-blue-500"
          onClick={(e) => {}}
        >
          <Eye className={cn("h-4 w-4")} />
        </Button>
      </TooltipWrapper>
      <TooltipWrapper content={"Delete"}>
        <Button
          variant="outline"
          size="icon"
          className="text-red-500"
          onClick={(e) => {}}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TooltipWrapper>
      <Button
        variant="outline"
        size={"sm"}
        className="text-xs"
        onClick={(e) => {}}
      >
        Import Members
      </Button>
    </div>
  );
};

export default GroupAction;

import EmptyIcon from "@/icons/EmptyIcon";
import React from "react";

const EmptyList = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="w-full flex items-center flex-wrap justify-center gap-10 py-10">
      <div className="grid gap-4 w-60">
        <div className="mx-auto">
          <EmptyIcon />
        </div>
        {children}
      </div>
    </div>
  );
};

export default EmptyList;

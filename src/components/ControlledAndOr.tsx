"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext } from "react-hook-form";
import { OperatorEnum } from "@/actions/enums/operator";

const AndOr = ({
  value = OperatorEnum.AND,
  onChange,
}: {
  value: OperatorEnum;
  onChange: (value: OperatorEnum) => void;
}) => {
  return (
    <div className="flex flex-row">
      <Button
        className="px-4"
        variant={value !== OperatorEnum.AND ? "outline" : "default"}
        onClick={() => onChange(OperatorEnum.AND)}
        type="button"
      >
        AND
      </Button>
      <Button
        variant={value !== "OR" ? "outline" : "default"}
        className="px-4"
        onClick={() => onChange(OperatorEnum.OR)}
        type="button"
      >
        OR
      </Button>
    </div>
  );
};

export const ControlledAndOr = ({ name }: { name: string }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <AndOr onChange={onChange} value={value} />
      )}
    />
  );
};

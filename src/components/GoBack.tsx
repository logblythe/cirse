"use client";

import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();

  return (
    <Button
      variant={"ghost"}
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft />
    </Button>
  );
};

export default GoBack;

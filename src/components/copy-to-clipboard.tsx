"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyToClipboardProps {
  text: string;
}

export default function CopyToClipboard({ text }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="icon"
      className="w-6 h-6"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  );
}

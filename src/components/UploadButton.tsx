"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { ArrowUpToLine } from "lucide-react";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>
          Upload PDF <ArrowUpToLine className="ml-1.5 h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>content</DialogContent>
    </Dialog>
  );
};

export default UploadButton;

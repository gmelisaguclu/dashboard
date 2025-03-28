"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteAboutImage } from "@/data/actions/aboutaction";
import { useTransition } from "react";

interface DeleteButtonProps {
  imageId: string;
  imageUrl: string;
}

export default function DeleteButton({ imageId, imageUrl }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      await deleteAboutImage(imageId, imageUrl);
    });
  };

  return (
    <div className="absolute top-2 right-2">
      <Button
        onClick={handleDelete}
        variant="destructive"
        size="icon"
        className="w-10 h-10 shadow-lg hover:shadow-xl cursor-pointer"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

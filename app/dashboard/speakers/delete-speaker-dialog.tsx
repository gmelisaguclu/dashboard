"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Speaker, deleteSpeaker } from "@/data/actions/speakersAction";

interface DeleteSpeakerDialogProps {
  speaker: Speaker;
}

export default function DeleteSpeakerDialog({
  speaker,
}: DeleteSpeakerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const { error } = await deleteSpeaker(speaker.id);

        if (error) {
          toast.error("Konuşmacı silinirken bir hata oluştu");
          return;
        }

        toast.success("Konuşmacı başarıyla silindi");
        setOpen(false);
      } catch (error) {
        console.error("Error deleting speaker:", error);
        toast.error("Beklenmeyen bir hata oluştu");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-red-600 hover:bg-red-700 text-white border-none"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl text-white">
            Konuşmacıyı Sil
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            <span className="text-white font-medium">{speaker.name}</span>{" "}
            isimli konuşmacıyı silmek istediğinize emin misiniz?
            <br />
            Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            disabled={isPending}
          >
            İptal
          </AlertDialogCancel>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Siliniyor...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Evet, Sil
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

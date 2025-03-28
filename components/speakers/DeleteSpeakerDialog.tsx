import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Speaker, deleteSpeaker } from "@/data/actions/speakersAction";

interface DeleteSpeakerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  speaker: Speaker | null;
  onSuccess: () => void;
}

export default function DeleteSpeakerDialog({
  isOpen,
  onOpenChange,
  speaker,
  onSuccess,
}: DeleteSpeakerDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!speaker) return;

    setIsProcessing(true);
    const { error } = await deleteSpeaker(speaker.id);
    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Konuşmacı başarıyla silindi");
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konuşmacıyı sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem konuşmacıyı silecek. Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className="bg-destructive"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

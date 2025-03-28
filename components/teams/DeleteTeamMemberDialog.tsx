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

import { TeamMember, deleteTeamMember } from "@/data/actions/teamsAction";

interface DeleteTeamMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onSuccess: () => void;
}

export default function DeleteTeamMemberDialog({
  isOpen,
  onOpenChange,
  teamMember,
  onSuccess,
}: DeleteTeamMemberDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!teamMember) return;

    setIsProcessing(true);
    const { error } = await deleteTeamMember(teamMember.id);
    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Takım üyesi başarıyla silindi");
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Takım üyesini sil</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem takım üyesini silecek. Bu işlem geri alınamaz.
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

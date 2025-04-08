import React, { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Partner, deletePartner } from "@/data/actions/partnersAction";

interface DeletePartnerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
  onSuccess: () => void;
}

const DeletePartnerDialog: React.FC<DeletePartnerDialogProps> = ({
  isOpen,
  onOpenChange,
  partner,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!partner) return;

    setIsDeleting(true);
    try {
      const { error } = await deletePartner(partner.id);
      if (error) {
        throw new Error(error);
      }
      toast.success("Sponsor başarıyla silindi");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Sponsor silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sponsoru Sil</AlertDialogTitle>
          <AlertDialogDescription>
            {partner?.title} isimli sponsoru silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>İptal</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Siliniyor...
              </>
            ) : (
              "Evet, Sil"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePartnerDialog;

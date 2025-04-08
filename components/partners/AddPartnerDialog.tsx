import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  PartnerType,
  createPartner,
  uploadPartnerLogo,
} from "@/data/actions/partnersAction";

interface AddPartnerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddPartnerDialog: React.FC<AddPartnerDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<PartnerType>(PartnerType.SILVER);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setLink("");
    setType(PartnerType.SILVER);
    setLogo(null);
    setLogoPreview(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Sponsor adı zorunludur");
      return;
    }

    setIsSubmitting(true);

    try {
      // If logo is provided, upload it first
      let logoUrl: string | undefined = undefined;
      if (logo) {
        const { url, error: uploadError } = await uploadPartnerLogo(logo);
        if (uploadError) {
          throw new Error(uploadError);
        }
        logoUrl = url || undefined;
      }

      // Create the partner
      const { data, error } = await createPartner({
        title,
        link: link || undefined,
        logo: logoUrl,
        type,
      });

      if (error) {
        throw new Error(error);
      }

      toast.success("Sponsor başarıyla eklendi");
      handleClose();
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Sponsor eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Sponsor Ekle</DialogTitle>
          <DialogDescription>
            Etkinliğe yeni bir sponsor ekleyin. Eklediğiniz sponsor hemen
            yayınlanacaktır.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Sponsor Adı
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Web Sitesi
              </Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Sponsor Tipi
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as PartnerType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sponsor Tipi Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PartnerType.MAIN}>Main Sponsor</SelectItem>
                  <SelectItem value={PartnerType.DIAMOND}>
                    Diamond Sponsor
                  </SelectItem>
                  <SelectItem value={PartnerType.GOLD}>Gold Sponsor</SelectItem>
                  <SelectItem value={PartnerType.SILVER}>
                    Silver Sponsor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo
              </Label>
              <div className="col-span-3">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="col-span-3"
                />
                {logoPreview && (
                  <div className="mt-2 h-24 w-full flex items-center justify-start">
                    <img
                      src={logoPreview}
                      alt="Logo Önizleme"
                      className="h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ekleniyor...
                </>
              ) : (
                "Ekle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartnerDialog;

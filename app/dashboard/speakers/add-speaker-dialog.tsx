"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createSpeaker,
  getMaxOrderIndex,
  uploadSpeakerPhoto,
  validateImageFile,
} from "@/data/actions/speakersAction";

interface AddSpeakerDialogProps {
  buttonText?: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export default function AddSpeakerDialog({
  buttonText = "Yeni Konuşmacı Ekle",
  buttonVariant = "default",
  buttonSize = "default",
}: AddSpeakerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    twitter: "",
    linkedin: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    title?: string;
    photo?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = await validateImageFile(file);
    if (validation.error) {
      setFormErrors((prev) => ({ ...prev, photo: validation.error as string }));
      return;
    }

    setPhotoFile(file);
    setFormErrors((prev) => ({ ...prev, photo: undefined }));

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: {
      name?: string;
      title?: string;
      photo?: string;
    } = {};

    if (!formData.name.trim()) {
      errors.name = "İsim alanı zorunludur";
    }

    if (!formData.title.trim()) {
      errors.title = "Unvan alanı zorunludur";
    }

    if (!photoFile) {
      errors.photo = "Fotoğraf alanı zorunludur";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload the photo
        const photoResult = await uploadSpeakerPhoto(photoFile!);
        if (photoResult.error || !photoResult.url) {
          toast.error("Fotoğraf yüklenirken bir hata oluştu");
          return;
        }

        // 2. Get the next order index
        const { orderIndex } = await getMaxOrderIndex();

        // 3. Create the speaker
        const result = await createSpeaker({
          name: formData.name,
          title: formData.title,
          photo: photoResult.url,
          twitter: formData.twitter || undefined,
          linkedin: formData.linkedin || undefined,
          order_index: orderIndex,
        });

        if (result.error) {
          toast.error("Konuşmacı eklenirken bir hata oluştu");
          return;
        }

        toast.success("Konuşmacı başarıyla eklendi");
        resetForm();
        setOpen(false);
      } catch (error) {
        toast.error("Beklenmeyen bir hata oluştu");
        console.error(error);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      title: "",
      twitter: "",
      linkedin: "",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            Yeni Konuşmacı Ekle
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Yeni bir konuşmacı eklemek için aşağıdaki formu doldurun.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                İsim <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Konuşmacının adı"
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={isPending}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Unvan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Örn: Frontend Developer"
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={isPending}
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo" className="text-white">
                Fotoğraf <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4">
                <div
                  className={`relative h-16 w-16 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center ${
                    !photoPreview
                      ? "border-2 border-dashed border-zinc-700"
                      : ""
                  }`}
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="photo"
                    name="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0"
                    disabled={isPending}
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Max 5MB, jpg, png veya gif
                  </p>
                </div>
              </div>
              {formErrors.photo && (
                <p className="text-sm text-red-500">{formErrors.photo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-white">
                Twitter Kullanıcı Adı
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  @
                </span>
                <Input
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="twitterkullaniciad"
                  className="bg-zinc-800 border-zinc-700 text-white pl-7"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-white">
                LinkedIn Profili
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/kullaniciadi"
                className="bg-zinc-800 border-zinc-700 text-white"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-transparent border-zinc-700 text-white"
              disabled={isPending}
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Konuşmacı Ekle
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import {
  createSpeaker,
  uploadSpeakerPhoto,
} from "@/data/actions/speakersAction";

const speakerSchema = z.object({
  name: z.string().min(1, { message: "İsim zorunludur" }),
  title: z.string().min(1, { message: "Alan zorunludur" }),
  photo: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

type SpeakerFormValues = z.infer<typeof speakerSchema>;

interface AddSpeakerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddSpeakerDialog({
  isOpen,
  onOpenChange,
  onSuccess,
}: AddSpeakerDialogProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<SpeakerFormValues>({
    resolver: zodResolver(speakerSchema),
    defaultValues: {
      name: "",
      title: "",
      photo: "",
      twitter: "",
      linkedin: "",
    },
  });

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);

    // Create a preview for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (values: SpeakerFormValues) => {
    setIsProcessing(true);
    let photoUrl = values.photo || undefined;

    // Upload photo if selected
    if (photoFile) {
      const uploadResult = await uploadSpeakerPhoto(photoFile);
      if (uploadResult.error) {
        toast.error(uploadResult.error);
        setIsProcessing(false);
        return;
      }
      photoUrl = uploadResult.url ? uploadResult.url : undefined;
    }

    // Create speaker
    const { error } = await createSpeaker({
      name: values.name,
      title: values.title,
      photo: photoUrl,
      twitter: values.twitter || undefined,
      linkedin: values.linkedin || undefined,
    });

    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Konuşmacı başarıyla eklendi");
      onOpenChange(false);
      form.reset();
      setPhotoFile(null);
      setPhotoPreview(null);
      onSuccess();
    }
  };

  const handleCancel = () => {
    form.reset();
    setPhotoFile(null);
    setPhotoPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Yeni Konuşmacı Ekle</DialogTitle>
          <DialogDescription>
            Etkinliğe yeni bir konuşmacı ekleyin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col items-center mb-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden mb-2 bg-muted flex items-center justify-center">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="relative">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1 text-primary text-sm">
                    <Upload size={14} />
                    Fotoğraf Yükle
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoChange(e)}
                  />
                </Label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    İsim <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ad Soyad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Alan <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frontend, Backend, UI/UX vb."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="@kullaniciadi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="LinkedIn profil URL'si" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                İptal
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Kaydet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

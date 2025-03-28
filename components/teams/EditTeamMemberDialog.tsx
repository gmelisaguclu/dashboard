import { useState, ChangeEvent, useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, User } from "lucide-react";
import { toast } from "sonner";

import {
  TeamMember,
  updateTeamMember,
  uploadTeamMemberPhoto,
} from "@/data/actions/teamsAction";

const teamMemberSchema = z.object({
  name: z.string().min(1, { message: "İsim zorunludur" }),
  title: z.string().min(1, { message: "Alan zorunludur" }),
  photo: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  telegram: z.string().optional(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

interface EditTeamMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember: TeamMember | null;
  onSuccess: () => void;
}

export default function EditTeamMemberDialog({
  isOpen,
  onOpenChange,
  teamMember,
  onSuccess,
}: EditTeamMemberDialogProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      title: "",
      photo: "",
      twitter: "",
      linkedin: "",
      telegram: "",
    },
  });

  // Update form when teamMember changes
  useEffect(() => {
    if (teamMember) {
      form.reset({
        name: teamMember.name,
        title: teamMember.title,
        photo: teamMember.photo || "",
        twitter: teamMember.twitter || "",
        linkedin: teamMember.linkedin || "",
        telegram: teamMember.telegram || "",
      });
      setPhotoPreview(teamMember.photo || null);
    }
  }, [teamMember, form]);

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

  const handleSubmit = async (values: TeamMemberFormValues) => {
    if (!teamMember) return;

    setIsProcessing(true);
    let photoUrl = values.photo;

    // Upload photo if selected
    if (photoFile) {
      const uploadResult = await uploadTeamMemberPhoto(photoFile);
      if (uploadResult.error) {
        toast.error(uploadResult.error);
        setIsProcessing(false);
        return;
      }
      photoUrl = uploadResult.url ? uploadResult.url : undefined;
    }

    // Update team member
    const { error } = await updateTeamMember(teamMember.id, {
      name: values.name,
      title: values.title,
      photo: photoUrl,
      twitter: values.twitter || undefined,
      linkedin: values.linkedin || undefined,
      telegram: values.telegram || undefined,
    });

    setIsProcessing(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Takım üyesi başarıyla güncellendi");
      onOpenChange(false);
      setPhotoFile(null);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setPhotoFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Takım Üyesi Düzenle</DialogTitle>
          <DialogDescription>
            Takım üyesi bilgilerini güncelleyin.
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
                    alt={teamMember?.name || "Preview"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="relative">
                <Label htmlFor="photo-edit-upload" className="cursor-pointer">
                  <div className="flex items-center gap-1 text-primary text-sm">
                    <Upload size={14} />
                    Fotoğraf Yükle
                  </div>
                  <input
                    id="photo-edit-upload"
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

            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telegram</FormLabel>
                  <FormControl>
                    <Input placeholder="@kullaniciadi" {...field} />
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
                Güncelle
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

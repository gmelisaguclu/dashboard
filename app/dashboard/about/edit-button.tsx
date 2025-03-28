"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Loader2, Save } from "lucide-react";
import { handleImageUpdate } from "@/data/actions/aboutaction";
import { AboutImage } from "@/data/actions/aboutaction";

interface EditButtonProps {
  image: AboutImage;
}

export default function EditButton({ image }: EditButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    startTransition(async () => {
      const result = await handleImageUpdate(
        formData,
        image.id,
        image.order_index
      );
      if (result.error) {
        setError(result.error as string);
      } else {
        setIsOpen(false);
        setError(null);
      }
    });
  };

  if (!isOpen) {
    return (
      <div className="absolute top-16 right-2">
        <Button
          onClick={() => setIsOpen(true)}
          variant="secondary"
          size="icon"
          className="w-10 h-10 shadow-lg hover:shadow-xl cursor-pointer bg-blue-500 hover:bg-blue-600 text-white"
          title="Düzenle"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      <Card className="relative w-full max-w-md mx-4 bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Görseli Düzenle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEdit} className="flex flex-col gap-6">
            {error && (
              <div
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid w-full gap-2">
              <Label htmlFor="name" className="text-white">
                Görsel Adı
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={image.name}
                placeholder="Görsel için bir isim girin"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="file" className="text-white">
                Görsel Seç (Opsiyonel)
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0 file:rounded-md cursor-pointer"
              />
              <p className="text-xs text-zinc-400 mt-1">
                Resmi değiştirmek istemiyorsanız boş bırakabilirsiniz.
              </p>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                disabled={isPending}
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isPending ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

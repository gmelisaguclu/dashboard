"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus } from "lucide-react";
import { handleImageUpload } from "@/data/actions/aboutaction";

interface AboutFormProps {
  cardIndex: number;
}

export function AboutForm({ cardIndex }: AboutFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const result = await handleImageUpload(formData, cardIndex);
    if (result.error) {
      setError(result.error as string);
    } else {
      setIsOpen(false);
      setError(null);
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
      >
        <Plus className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      <Card className="relative w-full max-w-md mx-4 bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Yeni Görsel Ekle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="flex flex-col gap-6">
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
                placeholder="Görsel için bir isim girin"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="file" className="text-white">
                Görsel Seç
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                className="bg-zinc-800 border-zinc-700 text-white file:bg-zinc-700 file:text-white file:border-0 file:rounded-md cursor-pointer"
                required
              />
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
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-white text-black hover:bg-zinc-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Yükle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

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
    formData.append("cardIndex", cardIndex.toString());
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
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Plus className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Yeni Görsel Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Görsel Adı</Label>
              <Input
                id="name"
                name="name"
                placeholder="Görsel için bir isim girin"
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="file">Görsel Seç</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
              >
                İptal
              </Button>
              <Button type="submit">
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

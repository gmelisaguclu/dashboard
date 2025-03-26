import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  AboutImage,
  fetchAboutImages,
  deleteAboutImage,
  handleImageUpload,
} from "@/data/actions/aboutaction";
import { AboutForm } from "./about-form";

export default async function AboutPage() {
  const { data: images, error } = await fetchAboutImages();

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            Görseller yüklenirken bir hata oluştu
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-12 text-center">
        About Sayfası Görselleri
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8 max-w-[1800px] mx-auto">
        {[0, 1, 2, 3].map((index) => {
          const image = images?.find((img) => img.order_index === index);

          return (
            <Card
              key={index}
              className="relative group bg-zinc-950 min-h-[600px] min-w-[400px] rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="absolute top-4 left-4 z-10 p-0">
                <CardTitle className="text-2xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">
                  {image ? image.name : `Görsel ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-6">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  {image ? (
                    <>
                      <Image
                        src={image.image_url}
                        alt={image.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <form
                        action={async () => {
                          "use server";
                          await deleteAboutImage(image.id, image.image_url);
                        }}
                        className="absolute top-2 right-2"
                      >
                        <Button
                          type="submit"
                          variant="destructive"
                          size="icon"
                          className="w-10 h-10 shadow-lg hover:shadow-xl"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-xl">
                      <AboutForm cardIndex={index} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

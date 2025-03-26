import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { fetchAboutImages, deleteAboutImage } from "@/data/actions/aboutaction";
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">About Sayfası Görselleri</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((index) => {
          const image = images?.find((img) => img.order_index === index);

          return (
            <Card key={index} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {image ? image.name : `Görsel ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square">
                  {image ? (
                    <>
                      <Image
                        src={image.image_url}
                        alt={image.name}
                        fill
                        className="object-cover rounded-md"
                        priority
                      />
                      <form
                        action={async () => {
                          "use server";
                          await deleteAboutImage(image.id, image.image_url);
                        }}
                      >
                        <Button
                          type="submit"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed rounded-md">
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

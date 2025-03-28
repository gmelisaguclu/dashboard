import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

import { AboutForm } from "../../../components/about/about-form";
import { deleteAboutImage, fetchAboutImages } from "@/data/actions/aboutaction";
import DeleteButton from "../../../components/about/delete-button";
import EditButton from "../../../components/about/edit-button";

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
              className="relative group bg-zinc-950 h-[400px] min-w-[550px] rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardHeader className="absolute top-4 left-4 z-10 p-0">
                <CardTitle className="text-2xl font-bold text-white bg-black/50 px-4 py-2 rounded-lg">
                  {image ? image.name : `Görsel ${index + 1}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full p-6">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                  {image ? (
                    <>
                      <div className="relative w-full h-full flex items-center justify-center p-4">
                        <Image
                          src={image.image_url}
                          alt={image.name}
                          className="max-w-full max-h-full object-contain"
                          width={500}
                          height={300}
                          style={{ objectFit: "contain" }}
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>
                      <DeleteButton
                        imageId={image.id}
                        imageUrl={image.image_url}
                      />
                      <EditButton image={image} />
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

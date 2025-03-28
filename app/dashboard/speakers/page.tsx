import { fetchSpeakers } from "@/data/actions/speakersAction";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Image from "next/image";
// @ts-ignore - These modules exist
import AddSpeakerDialog from "./add-speaker-dialog";
// @ts-ignore - These modules exist
import EditSpeakerDialog from "./edit-speaker-dialog";
// @ts-ignore - These modules exist
import DeleteSpeakerDialog from "./delete-speaker-dialog";

export default async function SpeakersPage() {
  // Type safe wrapper for error handling
  const speakersResult = await fetchSpeakers();
  const speakers = speakersResult.data;
  const error = speakersResult.error ? true : false;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Konuşmacı Yönetimi</h1>
        {speakers && speakers.length > 0 && <AddSpeakerDialog />}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Konuşmacılar yüklenirken bir hata oluştu.</p>
        </div>
      )}

      {!speakers || speakers.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900 rounded-lg border border-zinc-800 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-3">
            Henüz hiç konuşmacı eklenmemiş
          </h2>
          <p className="text-zinc-400 mb-6">
            Etkinliğiniz için konuşmacı eklemek için aşağıdaki butona tıklayın.
          </p>
          <AddSpeakerDialog
            buttonText="İlk Konuşmacıyı Ekle"
            buttonVariant="default"
            buttonSize="lg"
          />
        </div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-800/50">
                  <TableHead className="w-12 text-zinc-200">No</TableHead>
                  <TableHead className="w-20 text-zinc-200">Fotoğraf</TableHead>
                  <TableHead className="text-zinc-200">İsim</TableHead>
                  <TableHead className="text-zinc-200">Unvan</TableHead>
                  <TableHead className="text-zinc-200">Twitter</TableHead>
                  <TableHead className="text-zinc-200">LinkedIn</TableHead>
                  <TableHead className="text-right text-zinc-200">
                    İşlemler
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {speakers.map((speaker, index) => (
                  <TableRow
                    key={speaker.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/40"
                  >
                    <TableCell className="font-medium text-white">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {speaker.photo ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          <Image
                            src={speaker.photo}
                            alt={speaker.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                          <span className="text-zinc-400">N/A</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-white">{speaker.name}</TableCell>
                    <TableCell className="text-zinc-300">
                      {speaker.title}
                    </TableCell>
                    <TableCell>
                      {speaker.twitter ? (
                        <a
                          href={`https://twitter.com/${speaker.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          @{speaker.twitter}
                        </a>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {speaker.linkedin ? (
                        <a
                          href={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Profil
                        </a>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditSpeakerDialog speaker={speaker} />
                        <DeleteSpeakerDialog speaker={speaker} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

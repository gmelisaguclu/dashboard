import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, User } from "lucide-react";

import { Speaker } from "@/data/actions/speakersAction";

interface SpeakerListProps {
  speakers: Speaker[];
  onEdit: (speaker: Speaker) => void;
  onDelete: (speaker: Speaker) => void;
}

export default function SpeakerList({
  speakers,
  onEdit,
  onDelete,
}: SpeakerListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konuşmacılar Listesi</CardTitle>
        <CardDescription>Etkinlik konuşmacılarını yönetin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Resim</TableHead>
                <TableHead className="w-[200px]">İsim</TableHead>
                <TableHead className="w-[250px]">Alan</TableHead>
                <TableHead className="w-[120px]">Twitter</TableHead>
                <TableHead className="w-[120px]">LinkedIn</TableHead>
                <TableHead className="w-[180px]">Oluşturulma</TableHead>
                <TableHead className="text-right w-[120px]">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {speakers.map((speaker) => (
                <TableRow key={speaker.id}>
                  <TableCell>
                    {speaker.photo ? (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={speaker.photo}
                          alt={speaker.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{speaker.name}</TableCell>
                  <TableCell>{speaker.title}</TableCell>
                  <TableCell>
                    {speaker.twitter ? (
                      <a
                        href={`https://twitter.com/${speaker.twitter.replace(
                          /@/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        @{speaker.twitter.replace(/@/g, "")}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {speaker.linkedin ? (
                      <a
                        href={speaker.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Profil
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{formatDate(speaker.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(speaker)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive"
                        onClick={() => onDelete(speaker)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getSpeakers, Speaker } from "@/data/actions/speakersAction";

import AddSpeakerDialog from "@/components/speakers/AddSpeakerDialog";
import EditSpeakerDialog from "@/components/speakers/EditSpeakerDialog";
import DeleteSpeakerDialog from "@/components/speakers/DeleteSpeakerDialog";
import SpeakerList from "@/components/speakers/SpeakerList";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    loadSpeakers();
  }, []);

  const loadSpeakers = async () => {
    setLoading(true);
    const { data, error } = await getSpeakers();
    if (error) {
      toast.error(error);
    } else if (data) {
      setSpeakers(data);
    }
    setLoading(false);
  };

  const handleEdit = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (speaker: Speaker) => {
    setSelectedSpeaker(speaker);
    setIsDeleteAlertOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Konuşmacı Yönetimi</h1>
        {speakers.length > 0 && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Konuşmacı Ekle
          </Button>
        )}
      </div>

      {speakers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CardDescription className="text-center mb-4 text-lg">
              Henüz hiç konuşmacı eklenmemiş
            </CardDescription>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Konuşmacıyı Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SpeakerList
          speakers={speakers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Speaker Dialog */}
      <AddSpeakerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={loadSpeakers}
      />

      {/* Edit Speaker Dialog */}
      <EditSpeakerDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        speaker={selectedSpeaker}
        onSuccess={loadSpeakers}
      />

      {/* Delete Confirmation */}
      <DeleteSpeakerDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        speaker={selectedSpeaker}
        onSuccess={loadSpeakers}
      />
    </div>
  );
}

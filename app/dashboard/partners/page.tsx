"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getPartners, Partner } from "@/data/actions/partnersAction";

import AddPartnerDialog from "@/components/partners/AddPartnerDialog";
import EditPartnerDialog from "@/components/partners/EditPartnerDialog";
import DeletePartnerDialog from "@/components/partners/DeletePartnerDialog";
import PartnerList from "@/components/partners/PartnerList";

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const { data, error } = await getPartners();
    if (error) {
      toast.error(error);
    } else if (data) {
      setPartners(data);
    }
    setLoading(false);
  };

  const handleEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (partner: Partner) => {
    setSelectedPartner(partner);
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
        <h1 className="text-3xl font-bold">Sponsorlar</h1>
        {partners.length > 0 && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Sponsor Ekle
          </Button>
        )}
      </div>

      {partners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CardDescription className="text-center mb-4 text-lg">
              Henüz hiç sponsor eklenmemiş
            </CardDescription>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Sponsoru Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <PartnerList
          partners={partners}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Partner Dialog */}
      <AddPartnerDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={loadPartners}
      />

      {/* Edit Partner Dialog */}
      <EditPartnerDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        partner={selectedPartner}
        onSuccess={loadPartners}
      />

      {/* Delete Confirmation */}
      <DeletePartnerDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        partner={selectedPartner}
        onSuccess={loadPartners}
      />
    </div>
  );
}

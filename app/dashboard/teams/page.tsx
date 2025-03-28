"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { getTeamMembers, TeamMember } from "@/data/actions/teamsAction";

import AddTeamMemberDialog from "@/components/teams/AddTeamMemberDialog";
import EditTeamMemberDialog from "@/components/teams/EditTeamMemberDialog";
import DeleteTeamMemberDialog from "@/components/teams/DeleteTeamMemberDialog";
import TeamMemberList from "@/components/teams/TeamMemberList";

export default function TeamsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] =
    useState<TeamMember | null>(null);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    const { data, error } = await getTeamMembers();
    if (error) {
      toast.error(error);
    } else if (data) {
      setTeamMembers(data);
    }
    setLoading(false);
  };

  const handleEdit = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (teamMember: TeamMember) => {
    setSelectedTeamMember(teamMember);
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
        <h1 className="text-3xl font-bold">Takım Yönetimi</h1>
        {teamMembers.length > 0 && (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Üye Ekle
          </Button>
        )}
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <CardDescription className="text-center mb-4 text-lg">
              Henüz hiç takım üyesi eklenmemiş
            </CardDescription>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Takım Üyesini Ekle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TeamMemberList
          teamMembers={teamMembers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add Team Member Dialog */}
      <AddTeamMemberDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={loadTeamMembers}
      />

      {/* Edit Team Member Dialog */}
      <EditTeamMemberDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        teamMember={selectedTeamMember}
        onSuccess={loadTeamMembers}
      />

      {/* Delete Confirmation */}
      <DeleteTeamMemberDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        teamMember={selectedTeamMember}
        onSuccess={loadTeamMembers}
      />
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { Partner, PartnerType } from "@/data/actions/partnersAction";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Move } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface PartnerListProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (partner: Partner) => void;
}

// Helper function to get a human-readable partner type
const getPartnerTypeLabel = (type: PartnerType): string => {
  const typeLabels = {
    [PartnerType.MAIN]: "Main Sponsor",
    [PartnerType.DIAMOND]: "Diamond Sponsor",
    [PartnerType.GOLD]: "Gold Sponsor",
    [PartnerType.SILVER]: "Silver Sponsor",
  };

  return typeLabels[type] || type;
};

// Helper function to get a badge color based on partner type
const getPartnerTypeBadgeColor = (type: PartnerType): string => {
  const typeColors = {
    [PartnerType.MAIN]: "bg-indigo-500 hover:bg-indigo-600",
    [PartnerType.DIAMOND]: "bg-blue-500 hover:bg-blue-600",
    [PartnerType.GOLD]: "bg-amber-500 hover:bg-amber-600",
    [PartnerType.SILVER]: "bg-gray-400 hover:bg-gray-500",
  };

  return typeColors[type] || "";
};

const PartnerList: React.FC<PartnerListProps> = ({
  partners,
  onEdit,
  onDelete,
}) => {
  // Group partners by type
  const partnersByType = partners.reduce((acc, partner) => {
    if (!acc[partner.type]) {
      acc[partner.type] = [];
    }
    acc[partner.type].push(partner);
    return acc;
  }, {} as Record<PartnerType, Partner[]>);

  // Order of partner types to display
  const typeOrder = [
    PartnerType.MAIN,
    PartnerType.DIAMOND,
    PartnerType.GOLD,
    PartnerType.SILVER,
  ];

  return (
    <div className="space-y-8">
      {typeOrder.map((type) => {
        if (!partnersByType[type] || partnersByType[type].length === 0) {
          return null;
        }

        return (
          <div key={type} className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {getPartnerTypeLabel(type)}
              <Badge className={`ml-2 ${getPartnerTypeBadgeColor(type)}`}>
                {partnersByType[type].length}
              </Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnersByType[type].map((partner) => (
                <Card key={partner.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <div className="h-40 w-full mb-4 relative flex items-center justify-center bg-gray-100 rounded-md">
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={partner.title}
                              width={200}
                              height={150}
                              className="object-contain max-h-full p-2"
                            />
                          ) : (
                            <div className="text-gray-400">Logo Yok</div>
                          )}
                        </div>
                        <h3 className="font-medium text-lg mb-2">
                          {partner.title}
                        </h3>
                        {partner.link && (
                          <a
                            href={partner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline truncate"
                          >
                            {partner.link}
                          </a>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menü Aç</span>
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                            >
                              <path
                                d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.75C8.12132 13.75 8.625 13.2513 8.625 12.63C8.625 12.0087 8.12132 11.51 7.5 11.51C6.87868 11.51 6.375 12.0087 6.375 12.63C6.375 13.2513 6.87868 13.75 7.5 13.75Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(partner)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(partner)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Sil</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PartnerList;

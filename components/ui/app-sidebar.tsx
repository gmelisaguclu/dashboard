"use client";

import * as React from "react";
import {
  ChevronUp,
  DoorOpen,
  Moon,
  Sun,
  User2,
  Speech,
  Handshake,
  Images,
  Users,
} from "lucide-react";
// import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpenText,
  Home,
  Settings,
  MessageCircleQuestion,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { logout } from "@/data/actions/authActions";
import { toast } from "sonner";
const items = [
  // {
  //   title: "Homepage",
  //   url: "/dashboard/home",
  //   icon: Home,
  // },
  {
    title: "About",
    url: "/dashboard/about",
    icon: Images,
  },
  {
    title: "Speakers",
    url: "/dashboard/speakers",
    icon: Speech,
  },
  {
    title: "Partners",
    url: "/dashboard/partners",
    icon: Handshake,
  },
  {
    title: "Teams",
    url: "/dashboard/teams",
    icon: Users,
  },

  {
    title: "Faq",
    url: "/dashboard/faq",
    icon: MessageCircleQuestion,
  },
];

export function AppSidebar() {
  const { setTheme } = useTheme();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Çıkış işlemi başarılı bir şekilde gerçekleştirildi.");

      router.push("/auth/login");
    } catch (error) {
      console.error("Çıkış işlemi sırasında hata oluştu:", error);
    }
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between ">
            <SidebarGroupLabel>SEPYA</SidebarGroupLabel>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Hesap
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={handleSignOut}>
                  <span className="flex items-center gap-2">
                    <DoorOpen className="size-fit" />
                    sign out
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

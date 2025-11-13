"use client";

import * as React from "react";
import {
  Building2,
  Calendar,
  FileText,
  Film,
  GalleryVerticalEnd,
  Gift,
  Home,
  MapPin,
  Percent,
  PieChart,
  Settings2,
  ShoppingCart,
  Tag,
  Ticket,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { redirectConfig } from "@/helpers/redirect-config";
import { useProfile } from "@/api/hooks/use-profile";

// Smart Ticket Admin data
const data = {
  user: {
    name: "Admin",
    email: "admin@smartticket.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Smart Ticket",
      logo: GalleryVerticalEnd,
      plan: "Cinema Management",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: redirectConfig.dashboard,
      icon: Home,
    },
    {
      title: "Người dùng",
      url: redirectConfig.users,
      icon: Users,
    },
    {
      title: "Quản lý Rạp",
      url: redirectConfig.cinemas,
      icon: Building2,
    },
    {
      title: "Quản lý Phim",
      url: redirectConfig.movies,
      icon: Film,
    },
    {
      title: "Phòng chiếu",
      url: redirectConfig.rooms,
      icon: MapPin,
    },
    {
      title: "Ghế ngồi",
      url: redirectConfig.seats,
      icon: PieChart,
    },
    {
      title: "Suất chiếu",
      url: redirectConfig.showtimes,
      icon: Calendar,
    },
    {
      title: "Quản lý Vé",
      url: redirectConfig.tickets,
      icon: Ticket,
    },
    {
      title: "Đặt chỗ",
      url: redirectConfig.seatReservation,
      icon: Tag,
    },
    {
      title: "Combo & Dịch vụ",
      url: redirectConfig.combos,
      icon: ShoppingCart,
    },
    {
      title: "Giảm giá",
      url: redirectConfig.discounts,
      icon: Percent,
    },
    {
      title: "Tích điểm",
      url: redirectConfig.points,
      icon: Gift,
    },
    {
      title: "Nội dung",
      url: redirectConfig.contents,
      icon: FileText,
    },
    {
      title: "Cài đặt",
      url: redirectConfig.settings,
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useProfile();

  // Kiểm tra nếu profile tồn tại và có dữ liệu
  if (isLoading || !profile) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>

        <SidebarFooter>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser userProfile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

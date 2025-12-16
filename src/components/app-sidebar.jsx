import * as React from "react";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  ClipboardList,
  Pill,
  ListCheck,
  Hospital,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useLocation } from "react-router";
import { useEffect } from "react";

import { NavMain } from "@/components/nav-main";
import { NavExamples } from "@/components/nav-examples";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Doctors",
      url: "/doctors",
      icon: Stethoscope,
    },
    {
      title: "Patients",
      url: "/patients",
      icon: Users,
    },
    {
      title: "Appointments",
      url: "/appointments",
      icon: Calendar,
    },
    {
      title: "Diagnoses",
      url: "/diagnoses",
      icon: ClipboardList,
    },
    {
      title: "Prescriptions",
      url: "/prescriptions",
      icon: Pill,
    },
  ],
  examples: [
    {
      name: "Register",
      url: "/register",
      icon: ListCheck,
    },
    {
      name: "Forms & Validation",
      url: "/forms",
      icon: ListCheck,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const location = useLocation();

  console.log(location);

  let message = location.state?.message;
  let type = location.state?.type;

  useEffect(() => {
    if (message) {
      if (type === "error") {
        toast.error(message);
      } else if (type === "success") {
        toast.success(message);
      } else {
        toast(message);
      }
    }
  }, [message]);

  return (
    <>
      <Toaster position="top-center" richColors />
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <a href="#">
                  <Hospital className="!size-5" />
                  <span className="text-base font-semibold">Medical Clinic</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavExamples items={data.examples} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

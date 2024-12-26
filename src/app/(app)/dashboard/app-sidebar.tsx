"use client";

import nobglogoImage from "../../../../public/Images/EHPLlogoBgRemove.png";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/components/customeComponets/Logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Sidebar menu items
const items = [
  { title: "Dashboard", url: "/dashboard", icon: "dashboard" },
  { title: "Appointment", url: "/dashboard/appointment", icon: "appointment" },
  { title: "Messages", url: "/dashboard/messages", icon: "messages" },
  { title: "Doctors", url: "/dashboard/doctors", icon: "doctor" },
  { title: "Reports", url: "/dashboard/reports", icon: "reportsearch" },
  { title: "Prescription", url: "/dashboard/prescription", icon: "prescription" },
  { title: "Invoice", url: "/dashboard/invoice", icon: "invoice" },
  { title: "Settings", url: "/dashboard/settings", icon: "settings" },
];

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="">
      {/* Sidebar Header */}
      <SidebarHeader className="p-4">
        <Image src={nobglogoImage} alt="logo" width={200} height={100} priority />
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="cursor-pointer">
                  <motion.div
                    // Animation: active state and hover
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(135, 206, 235, 0.4)",
                    }}
                    animate={{
                      backgroundColor: pathname.startsWith(item.url)
                        ? "rgba(14, 165, 233, 1)"
                        : "rgba(255, 255, 255, 0)",
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex items-center space-x-4 p-2 rounded-lg ${
                      pathname.startsWith(item.url) ? "text-white" : "text-gray-400"
                    }`}
                  >
                    <Logo
          name={item.icon}
          iconSize={26}
          className={`${pathname.startsWith(item.url) ? "text-white" : "text-sky-500"}`}
          style={{ color: pathname.startsWith(item.url) ? "white" : "skyblue" }} />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg font-semibold"
                    >
                      {item.title}
                    </motion.span>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="mt-auto border-t border-gray-200">
        <SidebarMenu>
          {/* Help Center Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between p-2 space-x-2">
                <Logo
                    name="help"
                    iconSize={26}
                    className="text-sky-500"
                    containerClass="font-bold"
                    style={{ color: "#87CEEB", textShadow: "2px 2px 8px #FF0000" }}
                  />
                  <span className="text-md font-bold">Help Center</span>
                  <Logo
                    name="uparrow"
                    iconSize={26}
                    className="text-sky-500"
                    containerClass="font-bold shadow-sm rounded-md shadow-black"
                    style={{ color: "#87CEEB",}}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span className="text-md font-semibold">How to use this site?</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-md font-semibold">Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-md font-semibold">Contact us</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Logout Option */}
          <SidebarMenuItem>
            <span className="flex justify-center items-center space-x-2 p-2 cursor-pointer">
            <Logo name="logout" iconSize={26} className="text-sky-500" style={{ color: "skyblue" }}/>
              <b className="text-md font-semibold">Log out</b>
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

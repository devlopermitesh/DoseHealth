import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="w-screen flex">
        <AppSidebar  />
        <main className="flex-1 bg-[hsl(var(--dashboardbg))] overflow-auto flex">
          <SidebarTrigger className="lg:hidden" />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedLayout from "@/components/layouts/protected-layout";

interface MainLayoutProps {
  readonly children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ProtectedLayout>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Smart Ticket Admin</h2>
            </div>
          </header>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </SidebarProvider>
    </ProtectedLayout>
  );
}

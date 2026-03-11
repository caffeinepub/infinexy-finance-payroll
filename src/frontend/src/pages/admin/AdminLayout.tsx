import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, LogOut, Menu, PlusCircle, Users, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

type AdminPage = "all-payslips" | "create-payslip" | "manage-employees";

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  username: string;
  fullName: string;
  onLogout: () => void;
}

const navItems: {
  id: AdminPage;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "all-payslips", label: "All Payslips", icon: FileText },
  { id: "create-payslip", label: "Create Payslip", icon: PlusCircle },
  { id: "manage-employees", label: "Manage Employees", icon: Users },
];

export default function AdminLayout({
  children,
  activePage,
  onNavigate,
  username,
  fullName,
  onLogout,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-sm text-white shrink-0"
            style={{ background: "oklch(0.60 0.18 165)" }}
          >
            IF
          </div>
          <div>
            <div className="font-display font-black text-sm text-foreground tracking-wider">
              INFINEXY FINANCE
            </div>
            <div
              className="text-xs font-semibold"
              style={{ color: "oklch(0.45 0.18 165)" }}
            >
              Admin Portal
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id.replace(/-/g, "_")}.link`}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
              style={
                isActive
                  ? { background: "oklch(0.60 0.18 165)", color: "white" }
                  : {}
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-border">
        <div className="mb-3 px-1">
          <div className="text-sm font-semibold text-foreground">
            {fullName || username}
          </div>
          <div className="text-xs text-muted-foreground">Administrator</div>
        </div>
        <Button
          data-ocid="nav.logout.button"
          variant="destructive"
          size="sm"
          className="w-full font-semibold"
          onClick={onLogout}
          style={{ background: "oklch(0.55 0.17 20)", color: "white" }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/30 w-full"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-50 w-60 h-full flex flex-col border-r border-border bg-card"
          >
            <div className="absolute top-4 right-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display font-bold text-sm text-foreground">
            INFINEXY FINANCE
          </span>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

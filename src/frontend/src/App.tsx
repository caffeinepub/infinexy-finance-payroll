import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import PayslipViewPage from "./pages/PayslipViewPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AllPayslipsPage from "./pages/admin/AllPayslipsPage";
import CreatePayslipPage from "./pages/admin/CreatePayslipPage";
import ManageEmployeesPage from "./pages/admin/ManageEmployeesPage";
import EmployeeLayout from "./pages/employee/EmployeeLayout";
import MyPayslipsPage from "./pages/employee/MyPayslipsPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

type AdminPage = "all-payslips" | "create-payslip" | "manage-employees";

interface AppState {
  view: "login" | "admin" | "employee" | "payslip";
  role: string;
  username: string;
  fullName: string;
  adminPage: AdminPage;
  viewingPayslipId: bigint | null;
  returnView: "admin" | "employee";
}

const SESSION_KEY = "infinexy_session";

function AppInner() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          view: parsed.view || "login",
          role: parsed.role || "",
          username: parsed.username || "",
          fullName: parsed.fullName || "",
          adminPage: parsed.adminPage || "all-payslips",
          viewingPayslipId: null,
          returnView: parsed.returnView || "admin",
        };
      }
    } catch {
      // ignore
    }
    return {
      view: "login",
      role: "",
      username: "",
      fullName: "",
      adminPage: "all-payslips",
      viewingPayslipId: null,
      returnView: "admin",
    };
  });

  useEffect(() => {
    if (state.view !== "login") {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          view: state.view === "payslip" ? state.returnView : state.view,
          role: state.role,
          username: state.username,
          fullName: state.fullName,
          adminPage: state.adminPage,
          returnView: state.returnView,
        }),
      );
    }
  }, [state]);

  const handleLoginSuccess = (
    role: string,
    username: string,
    fullName: string,
  ) => {
    setState((prev) => ({
      ...prev,
      view: role === "admin" ? "admin" : "employee",
      role,
      username,
      fullName,
      adminPage: "all-payslips",
    }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setState((prev) => ({
      ...prev,
      view: "login",
      role: "",
      username: "",
      fullName: "",
      viewingPayslipId: null,
    }));
  };

  const handleViewPayslip = (payslipId: bigint) => {
    setState((prev) => ({
      ...prev,
      view: "payslip",
      viewingPayslipId: payslipId,
      returnView:
        prev.view === "admin" || prev.view === "employee"
          ? prev.view
          : prev.returnView,
    }));
  };

  const handleBackFromPayslip = () => {
    setState((prev) => ({
      ...prev,
      view: prev.returnView,
      viewingPayslipId: null,
    }));
  };

  if (state.view === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (state.view === "payslip" && state.viewingPayslipId !== null) {
    return (
      <PayslipViewPage
        payslipId={state.viewingPayslipId}
        onBack={handleBackFromPayslip}
      />
    );
  }

  if (state.view === "admin") {
    return (
      <AdminLayout
        activePage={state.adminPage}
        onNavigate={(page) =>
          setState((prev) => ({ ...prev, adminPage: page }))
        }
        username={state.username}
        fullName={state.fullName}
        onLogout={handleLogout}
      >
        {state.adminPage === "all-payslips" && (
          <AllPayslipsPage
            onCreatePayslip={() =>
              setState((prev) => ({ ...prev, adminPage: "create-payslip" }))
            }
            onViewPayslip={handleViewPayslip}
          />
        )}
        {state.adminPage === "create-payslip" && (
          <CreatePayslipPage
            onSuccess={() =>
              setState((prev) => ({ ...prev, adminPage: "all-payslips" }))
            }
          />
        )}
        {state.adminPage === "manage-employees" && <ManageEmployeesPage />}
      </AdminLayout>
    );
  }

  if (state.view === "employee") {
    return (
      <EmployeeLayout
        username={state.username}
        fullName={state.fullName}
        onLogout={handleLogout}
      >
        <MyPayslipsPage
          username={state.username}
          onViewPayslip={handleViewPayslip}
        />
      </EmployeeLayout>
    );
  }

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

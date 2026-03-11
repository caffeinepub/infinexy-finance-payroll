import { UserX, Users } from "lucide-react";
import { motion } from "motion/react";
import { useListAllEmployees } from "../../hooks/useQueries";

export default function ManageEmployeesPage() {
  const { data: employees, isLoading } = useListAllEmployees();

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary">
          <Users
            className="h-5 w-5"
            style={{ color: "oklch(0.45 0.18 165)" }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Manage Employees
          </h1>
          <p className="text-xs text-muted-foreground">
            View registered employees
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border border-border overflow-hidden bg-card"
        >
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">
              Registered Employees
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {employees?.length ?? 0} employee
              {(employees?.length ?? 0) !== 1 ? "s" : ""} registered
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !employees || employees.length === 0 ? (
            <div
              data-ocid="employees.empty_state"
              className="flex flex-col items-center py-12 text-center px-6"
            >
              <UserX className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-semibold text-foreground">
                No employees registered yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Employees can register from the login page
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Joined Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr
                      key={emp.username}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        {emp.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        @{emp.username}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(emp.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border p-5 bg-card"
        >
          <h2 className="font-semibold text-foreground mb-4">
            How to assign payslips to employees
          </h2>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                text: "Employee registers from the Login page using the Employee tab",
              },
              {
                step: "2",
                text: "Employee appears in the Registered Employees list on this page",
              },
              {
                step: "3",
                text: "Admin creates a payslip using Create Payslip and selects the employee",
              },
              {
                step: "4",
                text: "Employee can view and print their payslips from their Employee Portal",
              },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white mt-0.5"
                  style={{ background: "oklch(0.60 0.18 165)" }}
                >
                  {item.step}
                </div>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </div>
  );
}

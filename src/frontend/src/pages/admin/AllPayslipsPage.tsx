import { Button } from "@/components/ui/button";
import { Eye, FileText, Grid3X3, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Payslip } from "../../backend.d";
import { useDeletePayslip, useListAllPayslips } from "../../hooks/useQueries";

interface AllPayslipsPageProps {
  onCreatePayslip: () => void;
  onViewPayslip: (payslipId: bigint) => void;
}

export default function AllPayslipsPage({
  onCreatePayslip,
  onViewPayslip,
}: AllPayslipsPageProps) {
  const { data: payslips, isLoading } = useListAllPayslips();
  const deletePayslip = useDeletePayslip();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = async (payslip: Payslip) => {
    if (!confirm(`Delete payslip for ${payslip.employeeName}?`)) return;
    setDeletingId(payslip.payslipId);
    try {
      await deletePayslip.mutateAsync(payslip.payslipId);
      toast.success("Payslip deleted");
    } catch {
      toast.error("Failed to delete payslip");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary">
            <FileText
              className="h-5 w-5"
              style={{ color: "oklch(0.45 0.18 165)" }}
            />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              All Payslips
            </h1>
            <p className="text-xs text-muted-foreground">
              {payslips?.length ?? 0} payslip
              {(payslips?.length ?? 0) !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <Button
          data-ocid="payslips.new_payslip.button"
          onClick={onCreatePayslip}
          className="font-semibold text-white"
          style={{ background: "oklch(0.60 0.18 165)" }}
        >
          <Plus className="h-4 w-4 mr-2" /> New Payslip
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          data-ocid="payslips.loading_state"
          className="flex items-center justify-center py-20"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !payslips || payslips.length === 0 ? (
        <motion.div
          data-ocid="payslips.empty_state"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-secondary">
            <Grid3X3 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1">
            No payslips yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Create the first payslip using the button above
          </p>
        </motion.div>
      ) : (
        <div
          data-ocid="payslips.list"
          className="rounded-xl border border-border overflow-hidden bg-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Month / Year
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Net Payable
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payslips.map((p, index) => (
                  <motion.tr
                    key={p.payslipId.toString()}
                    data-ocid={`payslips.item.${index + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">
                      {p.employeeName}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.employeeId.toString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.month} {p.year.toString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.designation}
                    </td>
                    <td
                      className="px-4 py-3 text-sm font-bold text-right"
                      style={{ color: "oklch(0.45 0.18 165)" }}
                    >
                      ₹{p.netPayable.toString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          data-ocid={`payslips.view_button.${index + 1}`}
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs font-semibold border-border hover:bg-secondary"
                          onClick={() => onViewPayslip(p.payslipId)}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button
                          data-ocid={`payslips.delete_button.${index + 1}`}
                          size="sm"
                          variant="destructive"
                          className="h-8 px-3 text-xs font-semibold"
                          disabled={deletingId === p.payslipId}
                          onClick={() => handleDelete(p)}
                          style={{
                            background: "oklch(0.50 0.18 25)",
                            color: "white",
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

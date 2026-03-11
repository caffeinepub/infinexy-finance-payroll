import { Button } from "@/components/ui/button";
import { Eye, FileText, Grid3X3 } from "lucide-react";
import { motion } from "motion/react";
import { useListPayslipsByEmployee } from "../../hooks/useQueries";

interface MyPayslipsPageProps {
  username: string;
  onViewPayslip: (payslipId: bigint) => void;
}

export default function MyPayslipsPage({
  username,
  onViewPayslip,
}: MyPayslipsPageProps) {
  const { data: payslips, isLoading } = useListPayslipsByEmployee(username);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary">
          <FileText
            className="h-5 w-5"
            style={{ color: "oklch(0.45 0.18 165)" }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            My Payslips
          </h1>
          <p className="text-xs text-muted-foreground">
            {payslips?.length ?? 0} payslip
            {(payslips?.length ?? 0) !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !payslips || payslips.length === 0 ? (
        <div
          data-ocid="payslips.empty_state"
          className="flex flex-col items-center justify-center py-20 rounded-xl border border-border bg-card"
        >
          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-secondary">
            <Grid3X3 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground text-lg mb-1">
            No payslips yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Your payslips will appear here once issued
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {payslips.map((p, index) => (
            <motion.div
              key={p.payslipId.toString()}
              data-ocid={`payslips.item.${index + 1}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-xl border border-border p-5 flex flex-col gap-3 bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {p.month} {p.year.toString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {p.designation || "Employee"}
                  </div>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-bold"
                  style={{
                    background: "oklch(0.90 0.08 165)",
                    color: "oklch(0.35 0.18 165)",
                  }}
                >
                  {p.month.slice(0, 3)}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground">
                    Net Payable
                  </div>
                  <div
                    className="font-bold text-lg"
                    style={{ color: "oklch(0.45 0.18 165)" }}
                  >
                    ₹{p.netPayable.toString()}
                  </div>
                </div>
                <Button
                  data-ocid={`payslips.view_button.${index + 1}`}
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold border-border hover:bg-secondary"
                  onClick={() => onViewPayslip(p.payslipId)}
                >
                  <Eye className="h-3 w-3 mr-1" /> View
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

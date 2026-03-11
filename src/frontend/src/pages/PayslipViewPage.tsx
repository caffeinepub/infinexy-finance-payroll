import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { useGetPayslip } from "../hooks/useQueries";
import { numberToWords } from "../utils/numberToWords";

interface PayslipViewPageProps {
  payslipId: bigint;
  onBack: () => void;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

type InfoRow = [string, string, string, string];

export default function PayslipViewPage({
  payslipId,
  onBack,
}: PayslipViewPageProps) {
  const { data: payslip, isLoading } = useGetPayslip(payslipId);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Payslip not found</p>
          <Button variant="outline" className="mt-4" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const totalEarningsPayable =
    Number(payslip.totalEarningsPayable) ||
    Number(payslip.basicPayable) +
      Number(payslip.mobileAllowancePayable) +
      Number(payslip.incentivePayable);
  const totalEarningsActual =
    Number(payslip.totalEarningsActual) ||
    Number(payslip.basicActual) +
      Number(payslip.mobileAllowanceActual) +
      Number(payslip.incentiveActual);
  const totalDeductions =
    Number(payslip.totalDeductions) ||
    Number(payslip.insurance) + Number(payslip.professionTax);
  const netPayable = Number(payslip.netPayable);

  const employeeRows: InfoRow[] = [
    ["Employee Name", payslip.employeeName, "PAN No.", payslip.panNo],
    [
      "Employee ID",
      payslip.employeeId.toString(),
      "Aadhar Number",
      payslip.aadharNumber,
    ],
    ["Designation", payslip.designation, "Location", payslip.location],
    [
      "Business Unit",
      payslip.businessUnit,
      "Date of Birth",
      payslip.dateOfBirth,
    ],
    ["Date of Joining", payslip.dateOfJoining, "", ""],
    ["Days Paid", payslip.daysPaid.toString(), "", ""],
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Action Bar */}
      <div className="no-print sticky top-0 z-10 border-b border-border px-6 py-3 flex items-center justify-between bg-card">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground font-semibold"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div
          className="font-display font-bold text-sm"
          style={{ color: "oklch(0.45 0.18 165)" }}
        >
          INFINEXY FINANCE — Payslip
        </div>
        <Button
          data-ocid="print.print_button"
          onClick={handlePrint}
          className="font-bold text-white"
          style={{ background: "oklch(0.60 0.18 165)" }}
        >
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
      </div>

      {/* Payslip Content */}
      <div className="p-6 flex justify-center">
        <motion.div
          ref={printRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="payslip-print-container w-full max-w-3xl rounded-xl border border-border shadow-xl"
          style={{ background: "oklch(0.97 0 0)", color: "black" }}
        >
          {/* Header */}
          <div
            className="text-center py-5 px-6"
            style={{ borderBottom: "2px solid black" }}
          >
            <div
              className="font-display font-black text-2xl tracking-widest"
              style={{ color: "black" }}
            >
              INFINEXY FINANCE
            </div>
            <div className="text-xs mt-1" style={{ color: "#333" }}>
              401,402 Galav Chamber Dairy Den Sayajigunj Vadodara Gujarat-390005
            </div>
          </div>

          {/* Month Banner */}
          <div
            className="print-dark-bg text-center py-3 px-6 font-bold text-sm tracking-widest"
            style={{ background: "#111", color: "white" }}
          >
            PAY SLIP FOR THE MONTH OF {payslip.month.toUpperCase()} –{" "}
            {payslip.year.toString()}
          </div>

          {/* Employee Info Grid */}
          <table
            className="w-full text-xs"
            style={{ borderCollapse: "collapse" }}
          >
            <tbody>
              {employeeRows.map((row, i) => (
                <tr key={`emp-row-${i + 1}`}>
                  <td
                    className="px-3 py-2 font-semibold"
                    style={{
                      border: "1px solid black",
                      width: "20%",
                      background: "#f5f5f5",
                      color: "black",
                    }}
                  >
                    {row[0]}
                  </td>
                  <td
                    className="px-3 py-2"
                    style={{
                      border: "1px solid black",
                      width: "30%",
                      color: "black",
                    }}
                  >
                    {row[1]}
                  </td>
                  <td
                    className="px-3 py-2 font-semibold"
                    style={{
                      border: "1px solid black",
                      width: "20%",
                      background: "#f5f5f5",
                      color: "black",
                    }}
                  >
                    {row[2]}
                  </td>
                  <td
                    className="px-3 py-2"
                    style={{
                      border: "1px solid black",
                      width: "30%",
                      color: "black",
                    }}
                  >
                    {row[3]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Salary Details Header */}
          <div
            className="print-dark-bg text-center py-2 px-6 font-bold text-xs tracking-widest"
            style={{ background: "#111", color: "white" }}
          >
            SALARY DETAILS
          </div>

          {/* Salary Table */}
          <table
            className="w-full text-xs"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="print-dark-bg" style={{ background: "#333" }}>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Particulars
                </th>
                <th
                  className="px-3 py-2 text-right font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Actual Amount (₹)
                </th>
                <th
                  className="px-3 py-2 text-right font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Payable Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Basic
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.basicActual).toLocaleString("en-IN")}
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.basicPayable).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Mobile Allowance
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.mobileAllowanceActual).toLocaleString(
                    "en-IN",
                  )}
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.mobileAllowancePayable).toLocaleString(
                    "en-IN",
                  )}
                </td>
              </tr>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Incentive
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.incentiveActual).toLocaleString("en-IN")}
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.incentivePayable).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr className="print-shaded-bg" style={{ background: "#e0e0e0" }}>
                <td
                  className="px-3 py-2 font-bold"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Total Earnings
                </td>
                <td
                  className="px-3 py-2 text-right font-bold"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {totalEarningsActual.toLocaleString("en-IN")}
                </td>
                <td
                  className="px-3 py-2 text-right font-bold"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {totalEarningsPayable.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Net Payable */}
          <div
            className="px-3 py-3 font-bold text-sm"
            style={{
              border: "1px solid black",
              borderTop: "none",
              background: "#f9f9f9",
              color: "black",
            }}
          >
            Net Payable ₹{netPayable.toLocaleString("en-IN")} &nbsp;|&nbsp; INR{" "}
            {numberToWords(netPayable)} Only
          </div>

          {/* Deductions Header */}
          <div
            className="print-dark-bg text-center py-2 px-6 font-bold text-xs tracking-widest mt-2"
            style={{ background: "#111", color: "white" }}
          >
            DEDUCTIONS
          </div>

          {/* Deductions Table */}
          <table
            className="w-full text-xs"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="print-dark-bg" style={{ background: "#333" }}>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{
                    border: "1px solid black",
                    color: "white",
                    width: "70%",
                  }}
                >
                  Particulars
                </th>
                <th
                  className="px-3 py-2 text-right font-bold"
                  style={{
                    border: "1px solid black",
                    color: "white",
                    width: "30%",
                  }}
                >
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Insurance
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.insurance).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Profession Tax
                </td>
                <td
                  className="px-3 py-2 text-right"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {Number(payslip.professionTax).toLocaleString("en-IN")}
                </td>
              </tr>
              <tr className="print-shaded-bg" style={{ background: "#e0e0e0" }}>
                <td
                  className="px-3 py-2 font-bold"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  Total Deductions
                </td>
                <td
                  className="px-3 py-2 text-right font-bold"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {totalDeductions.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Payment Details Header */}
          <div
            className="print-dark-bg text-center py-2 px-6 font-bold text-xs tracking-widest mt-2"
            style={{ background: "#111", color: "white" }}
          >
            PAYMENT DETAILS
          </div>

          {/* Payment Details Table */}
          <table
            className="w-full text-xs"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="print-dark-bg" style={{ background: "#333" }}>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Payment Mode
                </th>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Bank Name
                </th>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  Account Number
                </th>
                <th
                  className="px-3 py-2 text-left font-bold"
                  style={{ border: "1px solid black", color: "white" }}
                >
                  IFSC Code
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {payslip.paymentMode}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {payslip.bankName}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {payslip.accountNumber}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ border: "1px solid black", color: "black" }}
                >
                  {payslip.ifscCode}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div
            className="px-6 py-4 mt-4 flex flex-col items-center gap-2"
            style={{ borderTop: "2px dashed black" }}
          >
            <p className="text-xs text-center italic" style={{ color: "#555" }}>
              This is a computerised document and does not require a signature.
            </p>
            <p className="text-xs self-end" style={{ color: "#555" }}>
              Date: {formatDate(payslip.createdAt)}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="no-print text-center py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}

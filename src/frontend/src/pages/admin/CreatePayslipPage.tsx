import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Employee } from "../../backend.d";
import { useCreatePayslip, useListAllEmployees } from "../../hooks/useQueries";

interface CreatePayslipPageProps {
  onSuccess: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-6">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
        {title}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function FormField({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export default function CreatePayslipPage({
  onSuccess,
}: CreatePayslipPageProps) {
  const { data: employees } = useListAllEmployees();
  const createPayslip = useCreatePayslip();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [form, setForm] = useState({
    employeeName: "",
    employeeId: "",
    panNo: "",
    aadharNumber: "",
    designation: "",
    location: "",
    businessUnit: "",
    dateOfBirth: "",
    dateOfJoining: "",
    daysPaid: "",
    basicActual: "",
    basicPayable: "",
    mobileAllowanceActual: "",
    mobileAllowancePayable: "",
    incentiveActual: "",
    incentivePayable: "",
    insurance: "",
    professionTax: "",
    paymentMode: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    month: "March",
    year: String(new Date().getFullYear()),
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleEmployeeSelect = (username: string) => {
    const emp = employees?.find((e) => e.username === username) || null;
    if (emp) {
      setSelectedEmployee(emp);
      setForm((prev) => ({
        ...prev,
        employeeName: emp.fullName,
        employeeId: emp.userId.toString(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }
    try {
      await createPayslip.mutateAsync({
        employeeUsername: selectedEmployee.username,
        employeeName: form.employeeName,
        employeeId: BigInt(
          form.employeeId || selectedEmployee.userId.toString(),
        ),
        panNo: form.panNo,
        aadharNumber: form.aadharNumber,
        designation: form.designation,
        location: form.location,
        businessUnit: form.businessUnit,
        dateOfBirth: form.dateOfBirth,
        dateOfJoining: form.dateOfJoining,
        daysPaid: BigInt(form.daysPaid || 0),
        basicActual: BigInt(form.basicActual || 0),
        basicPayable: BigInt(form.basicPayable || 0),
        mobileAllowanceActual: BigInt(form.mobileAllowanceActual || 0),
        mobileAllowancePayable: BigInt(form.mobileAllowancePayable || 0),
        incentiveActual: BigInt(form.incentiveActual || 0),
        incentivePayable: BigInt(form.incentivePayable || 0),
        insurance: BigInt(form.insurance || 0),
        professionTax: BigInt(form.professionTax || 0),
        paymentMode: form.paymentMode,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        month: form.month,
        year: BigInt(form.year || new Date().getFullYear()),
      });
      toast.success("Payslip created successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create payslip");
    }
  };

  const inputClass = "bg-input border-border h-10 text-sm";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary">
          <PlusCircle
            className="h-5 w-5"
            style={{ color: "oklch(0.45 0.18 165)" }}
          />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Create Payslip
          </h1>
          <p className="text-xs text-muted-foreground">
            Fill in employee and salary details
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="rounded-xl border border-border p-6 bg-card"
      >
        <SectionHeader title="Employee Selection" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Select Employee">
            <Select onValueChange={handleEmployeeSelect}>
              <SelectTrigger className="bg-input border-border h-10 text-sm">
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((emp) => (
                  <SelectItem key={emp.username} value={emp.username}>
                    {emp.fullName} (@{emp.username})
                  </SelectItem>
                ))}
                {(!employees || employees.length === 0) && (
                  <SelectItem value="__none__" disabled>
                    No employees registered
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Month">
            <Select value={form.month} onValueChange={(v) => set("month", v)}>
              <SelectTrigger className="bg-input border-border h-10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Year">
            <Input
              className={inputClass}
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              type="number"
              min="2020"
              max="2099"
            />
          </FormField>
        </div>

        <SectionHeader title="Employee Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Employee Name">
            <Input
              className={inputClass}
              value={form.employeeName}
              onChange={(e) => set("employeeName", e.target.value)}
              placeholder="Full name"
            />
          </FormField>
          <FormField label="Employee ID">
            <Input
              className={inputClass}
              value={form.employeeId}
              onChange={(e) => set("employeeId", e.target.value)}
              placeholder="ID number"
            />
          </FormField>
          <FormField label="PAN No.">
            <Input
              className={inputClass}
              value={form.panNo}
              onChange={(e) => set("panNo", e.target.value)}
              placeholder="ABCDE1234F"
            />
          </FormField>
          <FormField label="Aadhar Number">
            <Input
              className={inputClass}
              value={form.aadharNumber}
              onChange={(e) => set("aadharNumber", e.target.value)}
              placeholder="12 digit number"
            />
          </FormField>
          <FormField label="Designation">
            <Input
              className={inputClass}
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </FormField>
          <FormField label="Location">
            <Input
              className={inputClass}
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="City"
            />
          </FormField>
          <FormField label="Business Unit">
            <Input
              className={inputClass}
              value={form.businessUnit}
              onChange={(e) => set("businessUnit", e.target.value)}
              placeholder="Unit name"
            />
          </FormField>
          <FormField label="Date of Birth">
            <Input
              className={inputClass}
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </FormField>
          <FormField label="Date of Joining">
            <Input
              className={inputClass}
              value={form.dateOfJoining}
              onChange={(e) => set("dateOfJoining", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </FormField>
          <FormField label="Days Paid">
            <Input
              className={inputClass}
              value={form.daysPaid}
              onChange={(e) => set("daysPaid", e.target.value)}
              type="number"
              min="0"
              max="31"
              placeholder="0"
            />
          </FormField>
        </div>

        <SectionHeader title="Salary Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Basic (Actual) ₹">
            <Input
              className={inputClass}
              value={form.basicActual}
              onChange={(e) => set("basicActual", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Basic (Payable) ₹">
            <Input
              className={inputClass}
              value={form.basicPayable}
              onChange={(e) => set("basicPayable", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Mobile Allowance (Actual) ₹">
            <Input
              className={inputClass}
              value={form.mobileAllowanceActual}
              onChange={(e) => set("mobileAllowanceActual", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Mobile Allowance (Payable) ₹">
            <Input
              className={inputClass}
              value={form.mobileAllowancePayable}
              onChange={(e) => set("mobileAllowancePayable", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Incentive (Actual) ₹">
            <Input
              className={inputClass}
              value={form.incentiveActual}
              onChange={(e) => set("incentiveActual", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Incentive (Payable) ₹">
            <Input
              className={inputClass}
              value={form.incentivePayable}
              onChange={(e) => set("incentivePayable", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
        </div>

        <SectionHeader title="Deductions" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Insurance ₹">
            <Input
              className={inputClass}
              value={form.insurance}
              onChange={(e) => set("insurance", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
          <FormField label="Profession Tax ₹">
            <Input
              className={inputClass}
              value={form.professionTax}
              onChange={(e) => set("professionTax", e.target.value)}
              type="number"
              min="0"
              placeholder="0"
            />
          </FormField>
        </div>

        <SectionHeader title="Payment Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField label="Payment Mode">
            <Select
              value={form.paymentMode}
              onValueChange={(v) => set("paymentMode", v)}
            >
              <SelectTrigger className="bg-input border-border h-10 text-sm">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Bank Name">
            <Input
              className={inputClass}
              value={form.bankName}
              onChange={(e) => set("bankName", e.target.value)}
              placeholder="Bank name"
            />
          </FormField>
          <FormField label="Account Number">
            <Input
              className={inputClass}
              value={form.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value)}
              placeholder="Account number"
            />
          </FormField>
          <FormField label="IFSC Code">
            <Input
              className={inputClass}
              value={form.ifscCode}
              onChange={(e) => set("ifscCode", e.target.value)}
              placeholder="IFSC Code"
            />
          </FormField>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            data-ocid="create_payslip.submit_button"
            disabled={createPayslip.isPending}
            className="px-8 font-bold text-white"
            style={{ background: "oklch(0.60 0.18 165)" }}
          >
            {createPayslip.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
              </>
            ) : (
              "Create Payslip"
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}

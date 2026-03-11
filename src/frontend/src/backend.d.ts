import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreatePayslipInput {
    month: string;
    professionTax: bigint;
    employeeUsername: string;
    employeeName: string;
    ifscCode: string;
    dateOfBirth: string;
    designation: string;
    year: bigint;
    businessUnit: string;
    bankName: string;
    dateOfJoining: string;
    insurance: bigint;
    incentivePayable: bigint;
    employeeId: EmployeeId;
    aadharNumber: string;
    paymentMode: string;
    basicPayable: bigint;
    accountNumber: string;
    panNo: string;
    incentiveActual: bigint;
    basicActual: bigint;
    location: string;
    daysPaid: bigint;
    mobileAllowanceActual: bigint;
    mobileAllowancePayable: bigint;
}
export interface RegisterEmployeeInput {
    username: string;
    fullName: string;
}
export type Time = bigint;
export type EmployeeId = bigint;
export interface Employee {
    username: string;
    userId: EmployeeId;
    createdAt: Time;
    fullName: string;
}
export type PayslipId = bigint;
export interface UserProfile {
    username: string;
    role: string;
    fullName: string;
}
export interface Payslip {
    month: string;
    payslipId: PayslipId;
    professionTax: bigint;
    totalDeductions: bigint;
    employeeUsername: string;
    employeeName: string;
    ifscCode: string;
    dateOfBirth: string;
    designation: string;
    createdAt: bigint;
    year: bigint;
    businessUnit: string;
    bankName: string;
    dateOfJoining: string;
    insurance: bigint;
    netPayable: bigint;
    incentivePayable: bigint;
    totalEarningsPayable: bigint;
    employeeId: EmployeeId;
    aadharNumber: string;
    paymentMode: string;
    basicPayable: bigint;
    accountNumber: string;
    panNo: string;
    incentiveActual: bigint;
    basicActual: bigint;
    location: string;
    daysPaid: bigint;
    mobileAllowanceActual: bigint;
    mobileAllowancePayable: bigint;
    totalEarningsActual: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPayslip(payslipInput: CreatePayslipInput): Promise<PayslipId>;
    deletePayslip(payslipId: PayslipId): Promise<void>;
    getAllPayslips(): Promise<Array<Payslip>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEmployee(employeeId: EmployeeId): Promise<Employee | null>;
    getPayslip(payslipId: PayslipId): Promise<Payslip | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllEmployees(): Promise<Array<Employee>>;
    listAllPayslips(): Promise<Array<Payslip>>;
    listPayslipsByEmployee(username: string): Promise<Array<Payslip>>;
    registerEmployee(employee: RegisterEmployeeInput): Promise<EmployeeId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

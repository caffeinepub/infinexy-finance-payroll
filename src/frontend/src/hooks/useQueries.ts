import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreatePayslipInput } from "../backend.d";
import { useActor } from "./useActor";

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllEmployees() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllPayslips() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["payslips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllPayslips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListPayslipsByEmployee(username: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["payslips", "employee", username],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayslipsByEmployee(username);
    },
    enabled: !!actor && !isFetching && !!username,
  });
}

export function useGetPayslip(payslipId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["payslip", payslipId?.toString()],
    queryFn: async () => {
      if (!actor || payslipId === null) return null;
      return actor.getPayslip(payslipId);
    },
    enabled: !!actor && !isFetching && payslipId !== null,
  });
}

export function useCreatePayslip() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePayslipInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPayslip(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
  });
}

export function useDeletePayslip() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payslipId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePayslip(payslipId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payslips"] });
    },
  });
}

export function useRegisterEmployee() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { username: string; fullName: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerEmployee(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: {
      username: string;
      role: string;
      fullName: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

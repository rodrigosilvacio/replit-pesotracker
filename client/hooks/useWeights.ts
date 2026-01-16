import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/query-client";
import { Weight, WeightSummary } from "@/types/weight";

export function useWeights() {
  return useQuery<Weight[]>({
    queryKey: ["/api/weights"],
  });
}

export function useWeightSummary(weights: Weight[] | undefined): WeightSummary {
  if (!weights || weights.length === 0) {
    return {
      currentWeight: null,
      previousWeight: null,
      change: null,
      lowestWeight: null,
      highestWeight: null,
    };
  }

  const sortedByDateTime = [...weights].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date}T${b.time}`).getTime();
    return dateTimeB - dateTimeA;
  });

  const currentWeight = sortedByDateTime[0]?.weight ?? null;
  const previousWeight = sortedByDateTime[1]?.weight ?? null;
  const change = currentWeight !== null && previousWeight !== null
    ? currentWeight - previousWeight
    : null;

  const allWeights = weights.map((w) => w.weight);
  const lowestWeight = Math.min(...allWeights);
  const highestWeight = Math.max(...allWeights);

  return {
    currentWeight,
    previousWeight,
    change,
    lowestWeight,
    highestWeight,
  };
}

export function useCreateWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { date: string; time: string; weight: number }) => {
      const response = await apiRequest("POST", "/api/weights", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weights"] });
    },
  });
}

export function useUpdateWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { date?: string; time?: string; weight?: number } }) => {
      const response = await apiRequest("PUT", `/api/weights/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weights"] });
    },
  });
}

export function useDeleteWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/weights/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/weights"] });
    },
  });
}

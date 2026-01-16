export interface Weight {
  id: number;
  date: string;
  weight: number;
  createdAt: string;
}

export interface WeightSummary {
  currentWeight: number | null;
  previousWeight: number | null;
  change: number | null;
  lowestWeight: number | null;
  highestWeight: number | null;
}

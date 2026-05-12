export type EstimateStatus =
  | "pending"
  | "approved"
  | "in_progress"
  | "completed"
  | "canceled";

export interface EstimateItemCreate {
  kind: "labor" | "part";
  description: string;
  quantity: number;
  unit_price: number;
  unit_cost?: number | null;
}

export interface EstimateCreate {
  vehicle_id: string;
  status?: EstimateStatus;
  customer_notes?: string | null;
  internal_notes?: string | null;
  validity_days?: number;
  tax_percent?: number;
  discount_amount?: number;
  items: EstimateItemCreate[];
}

export interface EstimateOut extends Omit<EstimateCreate, "items"> {
  id: string;
  created_by_id?: string | null;
  items: (EstimateItemCreate & { id: string })[];
  subtotal: number;
  tax_amount: number;
  total: number;
}

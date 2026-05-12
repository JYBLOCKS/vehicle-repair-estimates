import { EstimateItemCreate, EstimateStatus } from "./Estimate";

export type Row = {
  id?: string;
  estimate_id?: string;
  owner_name: string;
  owner_phone?: string | null;
  owner_email?: string | null;
  brand: string;
  model: string;
  year?: number | null;
  plate?: string | null;
  vin?: string | null;
  mileage?: number | null;
  customer_notes?: string | null;
  internal_notes?: string | null;
  tax_percent?: number | null;
  discount_amount?: number | null;
  validity_days?: number | null;
  subtotal?: number;
  tax_amount?: number;
  total?: number;
  status?: EstimateStatus | undefined;
  items?: EstimateItemCreate[];
};

export interface VehicleCreate {
  owner_name: string;
  owner_phone?: string | null;
  owner_email?: string | null;
  brand: string;
  model: string;
  year?: number | null;
  plate?: string | null;
  vin?: string | null;
  mileage?: number | null;
}

export interface VehicleOut extends VehicleCreate {
  id: string;
}

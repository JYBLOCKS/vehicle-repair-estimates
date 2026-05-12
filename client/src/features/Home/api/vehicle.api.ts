import { VehicleCreate, VehicleOut } from "../models/Vehicle";

const baseUrl = import.meta.env.VITE_API_URL;

export const createVehicle = async (
  payload: VehicleCreate,
  accessToken: string,
): Promise<VehicleOut> => {
  const res = await fetch(`${baseUrl}/vehicles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Create vehicle failed: ${res.status}`);
  }
  return (await res.json()) as VehicleOut;
};

export const getVehicle = async (
  id: string,
  accessToken: string,
): Promise<VehicleOut> => {
  const res = await fetch(`${baseUrl}/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Get vehicle failed: ${res.status}`);
  }
  return (await res.json()) as VehicleOut;
};

export const updateVehicle = async (
  id: string,
  payload: VehicleCreate,
  accessToken: string,
): Promise<VehicleOut> => {
  const res = await fetch(`${baseUrl}/vehicles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Update vehicle failed: ${res.status}`);
  }
  return (await res.json()) as VehicleOut;
};

export const deleteVehicle = async (
  id: string,
  accessToken: string,
): Promise<void> => {
  const res = await fetch(`${baseUrl}/vehicles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Delete vehicle failed: ${res.status}`);
  }
};

import { EstimateCreate, EstimateOut } from "../models/Estimate";

const baseUrl = import.meta.env.VITE_API_URL;

export const listEstimates = async (
  accessToken: string,
  status: string = "",
): Promise<EstimateOut[]> => {
  const url = new URL(`${baseUrl}/estimates/`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`List estimates failed: ${res.status}`);
  }
  return (await res.json()) as EstimateOut[];
};

export const createEstimate = async (
  payload: EstimateCreate,
  accessToken: string,
): Promise<EstimateOut> => {
  const res = await fetch(`${baseUrl}/estimates/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Create estimate failed: ${res.status}`);
  }
  return (await res.json()) as EstimateOut;
};

export const deleteEstimate = async (
  id: string,
  accessToken: string,
): Promise<void> => {
  const res = await fetch(`${baseUrl}/estimates/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Delete estimate failed: ${res.status}`);
  }
};

export const updateEstimate = async (
  id: string,
  payload: EstimateCreate,
  accessToken: string,
): Promise<EstimateOut> => {
  const res = await fetch(`${baseUrl}/estimates/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Update estimate failed: ${res.status}`);
  }
  return (await res.json()) as EstimateOut;
};

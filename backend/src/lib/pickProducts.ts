// src/lib/pickProducts.ts
export function pickItemsFromApiJson(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json?.data?.items)) return json.data.items;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.results)) return json.results;
  return [];
}

export function pickTotalFromApiJson(json: any, fallbackLen: number): number {
  return (
    json?.total ??
    json?.data?.total ??
    json?.count ??
    json?.data?.count ??
    fallbackLen
  );
}

const API_BASE = "http://localhost:5157/api";

export type Product = {
  id: string;
  name: string;
  description: string;
  createDate: string;
  quantity: number;
  price: number;
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
}

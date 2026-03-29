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

// POST to update an existing product
export async function updateProduct(product: Product): Promise<Product> {
  const response = await fetch(`${API_BASE}/product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.status}`);
  }
  return response.json();
}

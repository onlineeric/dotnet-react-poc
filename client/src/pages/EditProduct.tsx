import { useState } from "react";
// useParams reads URL parameters (e.g., :id from "/edit/:id")
// useNavigate lets us navigate programmatically (e.g., go back to list)
import { useParams, useNavigate } from "react-router";
// useQueryClient gives access to the TanStack Query cache
// useMutation is like useQuery but for POST/PUT/DELETE operations
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateProduct, type Product } from "../api/products";

function EditProduct() {
  const { id } = useParams(); // extract :id from the URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Read the product from TanStack Query's cache instead of fetching again.
  // getQueryData returns whatever was last fetched for this queryKey.
  // This works because ProductList already fetched and cached the products.
  const cachedProducts = queryClient.getQueryData<Product[]>(["products"]);
  const product = cachedProducts?.find((p) => p.id === id);

  // Local state for the form fields, initialized from the cached product.
  // useState runs the initializer only once on mount, so edits won't be
  // overwritten if the cache updates in the background.
  const [form, setForm] = useState<Product | null>(product ?? null);

  // useMutation manages the POST request lifecycle (loading, error, success)
  // similar to useQuery but for write operations
  const mutation = useMutation({
    mutationFn: updateProduct, // the function that does the POST
    onSuccess: () => {
      // Mark the cached product list as stale so it will refetch
      // next time it's needed. With enabled: false on the list page,
      // it won't auto-refetch — user clicks "Get All Products" to refresh.
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/"); // go back to list page
    },
  });

  // If the product wasn't found in cache (e.g., user navigated directly to URL)
  if (!form) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <p className="text-red-500">Product not found. Go back and fetch products first.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Back to List
        </button>
      </main>
    );
  }

  // Helper to update a single field in the form state.
  // It uses the spread operator to copy existing form data,
  // then overrides just the field that changed.
  const updateField = (field: keyof Product, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h2 className="mb-4 text-xl font-bold">Edit Product</h2>

      <div className="space-y-4 rounded bg-white p-6 shadow">
        {/* ID field - readOnly so user can see it but can't change it */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <input
            value={form.id}
            readOnly
            className="mt-1 w-full rounded border bg-gray-100 p-2 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => updateField("quantity", parseInt(e.target.value) || 0)}
            className="mt-1 w-full rounded border p-2"
          />
        </div>

        {/* Show error message if the POST request fails */}
        {mutation.isError && (
          <p className="text-red-500">Error: {mutation.error.message}</p>
        )}

        <div className="flex gap-3">
          {/* mutation.mutate() triggers the POST request */}
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </main>
  );
}

export default EditProduct;

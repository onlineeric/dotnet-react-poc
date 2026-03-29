import { useQuery } from "@tanstack/react-query";
// useNavigate is a React Router hook that returns a function to navigate programmatically
import { useNavigate } from "react-router";
import { fetchProducts, type Product } from "../api/products";

function ProductList() {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: false,
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <button
        onClick={() => refetch()}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Get All Products
      </button>

      {isLoading && <p className="mt-4 text-gray-500">Loading...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}

      {data && (
        <table className="mt-4 w-full border-collapse bg-white shadow">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Price</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product: Product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">${product.price.toFixed(2)}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">
                  {/* Navigate to edit page with the product id in the URL */}
                  <button
                    onClick={() => navigate(`/edit/${product.id}`)}
                    className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

export default ProductList;

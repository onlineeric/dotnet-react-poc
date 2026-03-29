// useQuery is a TanStack Query hook that manages async data fetching,
// including loading state, error handling, and caching
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product } from "./api/products";

function App() {
  // useQuery returns an object with the fetch state
  // - data: the fetched data (undefined until loaded)
  // - isLoading: true while the request is in flight
  // - error: the error object if the request failed
  // - refetch: function to manually trigger a re-fetch
  //
  // enabled: false means "don't fetch automatically on mount",
  // so we can trigger it manually with the button via refetch()
  const { data, isLoading, error, refetch } = useQuery<Product[]>({
    queryKey: ["products"], // unique cache key for this query
    queryFn: fetchProducts, // the function that does the actual fetch
    enabled: false, // don't fetch on page load, wait for button click
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Product Store</h1>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        {/* Fetch button - calls refetch() to trigger the query */}
        <button
          onClick={() => refetch()}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Get All Products
        </button>

        {/* Conditional rendering based on query state */}
        {isLoading && <p className="mt-4 text-gray-500">Loading...</p>}
        {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}

        {/* Only render the table when data exists */}
        {data && (
          <table className="mt-4 w-full border-collapse bg-white shadow">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over the products array to render a row for each */}
              {data.map((product: Product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">${product.price.toFixed(2)}</td>
                  <td className="p-3">{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;

// Routes and Route define which component renders for each URL path
import { Routes, Route } from "react-router";
import ProductList from "./pages/ProductList";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 p-4 text-white">
        <h1 className="text-2xl font-bold">Product Store</h1>
      </header>

      {/* Routes matches the current URL and renders the matching component */}
      {/* "/" renders ProductList, "/edit/:id" renders EditProduct */}
      {/* :id is a URL parameter — e.g., /edit/abc123 sets id = "abc123" */}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/edit/:id" element={<EditProduct />} />
      </Routes>
    </div>
  );
}

export default App;

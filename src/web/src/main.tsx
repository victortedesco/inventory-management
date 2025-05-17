import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/LoginPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { Toaster } from "sonner";
import ProductPage from "./pages/ProductPage.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/create-product" element={<CreateProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </>
);

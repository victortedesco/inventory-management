import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import ProductPage from "./pages/product/ProductPage.tsx";
import CreateProductPage from "./pages/product/CreateProductPage.tsx";
import CreateUserPage from "./pages/user/CreateUserPage.tsx";
import CategoryPage from "./pages/category/CategoryPage.tsx";
import CreateCategoryPage from "./pages/category/CreateCategoryPage.tsx";
import UserPage from "./pages/user/UserPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product" element={<CreateProductPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/user/:id" element={<CreateUserPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/category" element={<CreateCategoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </>
);

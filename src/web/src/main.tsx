import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import ListProductsPage from "./pages/product/ListProductsPage.tsx";
import CreateProductPage from "./pages/product/CreateProductPage.tsx";
import CreateUserPage from "./pages/user/CreateUserPage.tsx";
import ListCategoriesPage from "./pages/category/ListCategoriesPage.tsx";
import CreateCategoryPage from "./pages/category/CreateCategoryPage.tsx";
import ListUsersPage from "./pages/user/ListUsersPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import CategoryPage from "./pages/category/CategoryPage.tsx";
import ProductPage from "./pages/product/ProductPage.tsx";
import ListBoxesPage from "./pages/box/ListBoxesPage.tsx";
import ListHistoryPage from "./pages/history/ListHistoryPage.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/products" element={<ListProductsPage />} />
        <Route path="/product/edit/" element={<CreateProductPage />} />
        <Route path="/product/edit/:id" element={<CreateProductPage />} />
        <Route path="/users" element={<ListUsersPage />} />
        <Route path="/user/edit/" element={<CreateUserPage />} />
        <Route path="/user/edit/:id" element={<CreateUserPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/categories" element={<ListCategoriesPage />} />
        <Route path="/category/edit/" element={<CreateCategoryPage />} />
        <Route path="/category/edit/:id" element={<CreateCategoryPage />} />
        <Route path="/boxes" element={<ListBoxesPage />} />
        <Route path="/history" element={<ListHistoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </>
);

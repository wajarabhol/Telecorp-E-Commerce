import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./components/Cart";
import Product from "./components/Product";
import ProductCreate from "./components/ProductCreate";
import ProductShowDetails from "./components/ProductShowDetails";

export default function App() {
  const [token, setToken] = React.useState<string | null>("");

  useEffect(() => {
    const getToken: string | null = localStorage.getItem("token"); // ตัวแปร token จะดึงค่า token ที่อยู่ใน local storage
    if (getToken) {
      setToken(getToken);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/productshow/:id" element={<ProductShowDetails />} />
        <Route path="/productcreate" element={<ProductCreate />} />
        <Route path="/productcreate/:id" element={<ProductCreate />} />

        <Route path="/carts" element={<Cart />} />
      </Routes>
    </Router>
  );
}
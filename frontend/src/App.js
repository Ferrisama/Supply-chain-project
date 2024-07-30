import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import Blockchain from "./components/Blockchain";
import Dashboard from "./components/Dashboard";
import ProductAnalytics from "./components/ProductAnalytics";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/blockchain" element={<Blockchain />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product-analytics" element={<ProductAnalytics />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

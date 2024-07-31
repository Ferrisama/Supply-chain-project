import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import Blockchain from "./components/Blockchain";
import Dashboard from "./components/Dashboard";
import ProductAnalytics from "./components/ProductAnalytics";
import withRoleAccess from "./components/withRoleAccess";
import Unauthorized from "./components/Unauthorized";

const theme = createTheme();

const ProtectedProductAnalytics = withRoleAccess(
  ["admin", "manager"],
  ProductAnalytics
);
const ProtectedBlockchain = withRoleAccess(["admin"], Blockchain);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/blockchain" element={<ProtectedBlockchain />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/product-analytics"
                element={<ProtectedProductAnalytics />}
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

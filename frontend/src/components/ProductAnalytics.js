import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const ProductAnalytics = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          axios.get("http://localhost:5001/api/products"),
          axios.get("http://localhost:5001/api/orders"),
        ]);

        setProducts(productsResponse.data);
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateProductSales = () => {
    const salesData = {};
    orders.forEach((order) => {
      if (salesData[order.product_id]) {
        salesData[order.product_id] += order.quantity;
      } else {
        salesData[order.product_id] = order.quantity;
      }
    });
    return Object.entries(salesData).map(([productId, quantity]) => ({
      productId: parseInt(productId),
      quantity,
    }));
  };

  const calculateProductTrend = () => {
    const trendData = {};
    orders.forEach((order) => {
      const date = new Date(order.created_at).toISOString().split("T")[0];
      if (trendData[date]) {
        trendData[date] += order.quantity;
      } else {
        trendData[date] = order.quantity;
      }
    });
    return Object.entries(trendData).map(([date, quantity]) => ({
      date,
      quantity,
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const productSalesData = calculateProductSales();
  const productTrendData = calculateProductTrend();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Product Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2} height={400}>
              <Typography variant="h6">Product Sales</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productSalesData}>
                  <XAxis dataKey="productId" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantity" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2} height={400}>
              <Typography variant="h6">Sales Trend</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productTrendData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Product Inventory</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell>Total Sales</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => {
                      const sales =
                        productSalesData.find(
                          (item) => item.productId === product.id
                        )?.quantity || 0;
                      return (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{sales}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductAnalytics;

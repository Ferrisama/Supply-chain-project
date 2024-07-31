import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosConfig";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    orders: [],
    productCategories: [],
  });
  const [blockchainData, setBlockchainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, ordersResponse, blockchainResponse] =
          await Promise.all([
            axiosInstance.get("/products"),
            axiosInstance.get("/orders"),
            axiosInstance.get("/blockchain"),
          ]);

        const totalProducts = productsResponse.data.length;
        const totalOrders = ordersResponse.data.length;
        const averageOrderValue = calculateAverageOrderValue(
          ordersResponse.data
        );
        const productCategories = calculateProductCategories(
          productsResponse.data
        );

        setKpis({
          totalProducts,
          totalOrders,
          averageOrderValue,
          orders: ordersResponse.data,
          productCategories,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const calculateAverageOrderValue = (orders) => {
    if (orders.length === 0) return 0;
    const totalValue = orders.reduce((sum, order) => sum + order.quantity, 0);
    return totalValue / orders.length;
  };

  const calculateOrderTrend = (orders) => {
    const monthlyOrders = {};
    orders.forEach((order) => {
      if (order.created_at) {
        const date = new Date(order.created_at);
        if (!isNaN(date.getTime())) {
          const month = date.toLocaleString("default", { month: "short" });
          monthlyOrders[month] = (monthlyOrders[month] || 0) + 1;
        }
      }
    });
    return Object.entries(monthlyOrders).map(([month, count]) => ({
      month,
      count,
    }));
  };

  const calculateProductCategories = (products) => {
    const categories = {};
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const orderTrendData = calculateOrderTrend(kpis.orders);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{kpis.totalProducts}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{kpis.totalOrders}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Average Order Quantity</Typography>
              <Typography variant="h4">
                {kpis.averageOrderValue.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2} height={400}>
              <Typography variant="h6">Order Trend</Typography>
              {orderTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderTrendData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography>No order trend data available.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3}>
            <Box p={2} height={400}>
              <Typography variant="h6">Product Categories</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kpis.productCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {kpis.productCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={2}>
              <Typography variant="h6">Blockchain Visualization</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Block #</TableCell>
                      <TableCell>Hash</TableCell>
                      <TableCell>Previous Hash</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blockchainData.map((block, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{block.hash.substring(0, 10)}...</TableCell>
                        <TableCell>
                          {block.previous_hash.substring(0, 10)}...
                        </TableCell>
                        <TableCell>
                          {new Date(block.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {JSON.stringify(block.data).substring(0, 20)}...
                        </TableCell>
                      </TableRow>
                    ))}
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

export default Dashboard;

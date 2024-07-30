import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const productsResponse = await axios.get(
          "http://localhost:5001/api/products"
        );
        const ordersResponse = await axios.get(
          "http://localhost:5001/api/orders"
        );

        const totalProducts = productsResponse.data.length;
        const totalOrders = ordersResponse.data.length;
        const averageOrderValue = calculateAverageOrderValue(
          ordersResponse.data
        );

        setKpis({
          totalProducts,
          totalOrders,
          averageOrderValue,
          orders: ordersResponse.data, // Store the full orders data
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
    const totalValue = orders.reduce(
      (sum, order) => sum + order.quantity * (order.price || 0),
      0
    );
    return totalValue / orders.length;
  };

  const calculateOrderTrend = (orders) => {
    const monthlyOrders = {};
    orders.forEach((order) => {
      // Ensure order.createdAt is a valid date string
      const date = new Date(order.createdAt);
      if (!isNaN(date.getTime())) {
        const month = date.toLocaleString("default", { month: "short" });
        monthlyOrders[month] = (monthlyOrders[month] || 0) + 1;
      }
    });
    return Object.entries(monthlyOrders).map(([month, count]) => ({
      month,
      count,
    }));
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const orderTrendData = calculateOrderTrend(kpis.orders);

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
              <Typography variant="h6">Average Order Value</Typography>
              <Typography variant="h4">
                ${kpis.averageOrderValue.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box p={2} height={400}>
              {" "}
              {/* Ensure the box has a defined height */}
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
                <Typography>No order data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

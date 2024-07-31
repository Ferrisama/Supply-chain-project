import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" paragraph>
        You do not have permission to access this page.
      </Typography>
      <Button
        component={Link}
        to="/dashboard"
        variant="contained"
        color="primary"
      >
        Return to Dashboard
      </Button>
    </Container>
  );
};

export default Unauthorized;

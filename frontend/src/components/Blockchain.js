import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  Paper,
} from "@mui/material";

const Blockchain = () => {
  const [blocks, setBlocks] = useState([]);
  const [newBlockData, setNewBlockData] = useState("");

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/blockchain", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlocks(response.data);
    } catch (error) {
      console.error("Error fetching blockchain data", error);
      alert(
        "Error fetching blockchain data: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  const handleAddBlock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/blockchain",
        { data: newBlockData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("New block added:", response.data);
      setNewBlockData("");
      fetchBlocks();
    } catch (error) {
      console.error("Error adding block", error);
      alert(
        "Error adding block: " + error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Blockchain
      </Typography>
      <List>
        {blocks.map((block, index) => (
          <ListItem key={index}>
            <Paper elevation={3} style={{ padding: "10px", width: "100%" }}>
              <ListItemText
                primary={`Block ${index + 1}`}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Hash: {block.hash}
                      <br />
                      Previous Hash: {block.previous_hash}
                      <br />
                      Timestamp: {new Date(block.timestamp).toLocaleString()}
                      <br />
                      Data: {JSON.stringify(block.data)}
                    </Typography>
                  </>
                }
              />
            </Paper>
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={handleAddBlock} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Block Data"
          value={newBlockData}
          onChange={(e) => setNewBlockData(e.target.value)}
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Block
        </Button>
      </Box>
    </Container>
  );
};

export default Blockchain;

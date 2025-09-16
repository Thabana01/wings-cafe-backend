const express = require("express");
const cors = require("cors");
const path = require("path"); // Added to serve React
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const saleRoutes = require("./routes/saleRoutes");

app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", saleRoutes);

// --- Serve React Frontend in Production ---
if (process.env.NODE_ENV === "production") {
  // Serve static files from the React build folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Handle all other routes and send back React index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

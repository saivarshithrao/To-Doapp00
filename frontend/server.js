const express = require("express");
const path = require("path");

const app = express();

// Bind to the port injected by Railway
const PORT = process.env.PORT || 3000;

// CRA builds to "build". Change to "dist" if you migrate to Vite.
const BUILD_DIR = "build";

// Serve the static files from the build directory
app.use(express.static(path.join(__dirname, BUILD_DIR)));

// Catch-all route to prevent 404 errors during client-side SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend static server running on port ${PORT}`);
});

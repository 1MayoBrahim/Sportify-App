// Import libraries.
const express = require("express");

const PORT = 8000;

const app = express();

// Server will be expecting json-formatted data.
app.use(express.json());

// Requests for static files will look in public.
app.use(express.static("public"));

app.get("*", (request, response) => {
  return response
    .status(404)
    .json({ status: 404, message: "No endpoint found." });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));

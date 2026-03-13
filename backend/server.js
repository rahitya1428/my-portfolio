const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to receive contact form
app.post("/send-message", (req, res) => {

    const { name, email, subject, message } = req.body;

    console.log("New message received:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    res.send("Message received successfully!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
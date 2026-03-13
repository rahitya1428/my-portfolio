const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB"/* , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}*/)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const messageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model("Message", messageSchema);

const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to read form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to receive contact form
/*app.post("/send-message", (req, res) => {

    const { name, email, subject, message } = req.body;

    console.log("New message received:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    res.send("Message received successfully!");
});
Replacing with database storage logic
*/
app.post("/send-message", async (req, res) => {

    const { name, email, subject, message } = req.body;

    try {

        const newMessage = new Message({
            name,
            email,
            subject,
            message
        });

        await newMessage.save();

        console.log("New message saved:", newMessage);

        res.send("Message sent successfully!");

    } catch (error) {

        console.error(error);
        res.status(500).send("Something went wrong");

    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
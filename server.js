const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sahaye', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Database connection failed:", err));

// Donation Schema
const donationSchema = new mongoose.Schema({
    donorName: String,
    phone: String,
    donationType: String,
    reason: String,
});

const Donation = mongoose.model('Donation', donationSchema);

// Routes
app.post('/donate', async (req, res) => {
    try {
        const donation = new Donation(req.body);
        await donation.save();
        res.status(201).send({ message: "Donation successful!" });
    } catch (err) {
        res.status(500).send({ message: "Error occurred", error: err });
    }
});

app.get('/donations', async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).send(donations);
    } catch (err) {
        res.status(500).send({ message: "Error fetching donations", error: err });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

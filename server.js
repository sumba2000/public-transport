const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/busBooking', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schemas and models
const bookingSchema = new mongoose.Schema({
    route: String,
    bus: String,
    seat: Number,
    name: String,
    mobile: Number,
    pickup: String,
    drop: String
});

const Booking = mongoose.model('Booking', bookingSchema);

// Routes
app.post('/book', async (req, res) => {
    const booking = new Booking(req.body);
    try {
        await booking.save();
        res.status(201).send(booking);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).send(bookings);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

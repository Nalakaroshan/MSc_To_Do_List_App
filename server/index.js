const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using environment variable
const mongoURI = process.env.MONGO_URL || 'mongodb+srv://apps:apps@msc.benfy.mongodb.net/?retryWrites=true&w=majority&appName=MSc'; // Fallback for local development
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//mongodb+srv://apps:<db_password>@msc.benfy.mongodb.net/?retryWrites=true&w=majority&appName=MSc
// Connection event listeners
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully.');
});
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
});

// REST API Endpoints

// Get all tasks
app.get('/get', async (req, res) => {
    try {
        const tasks = await TodoModel.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update task status
app.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { done } = req.body;

    try {
        const updatedTask = await TodoModel.findByIdAndUpdate(
            id,
            { done },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edit the task
app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { task, done } = req.body;

    try {
        const updatedTask = await TodoModel.findByIdAndUpdate(
            id,
            { task, done },
            { new: true }
        );
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new task
app.post('/add', async (req, res) => {
    const { task } = req.body;

    try {
        const newTask = await TodoModel.create({ task });
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete task
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await TodoModel.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

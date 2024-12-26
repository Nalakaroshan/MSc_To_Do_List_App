const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://apps:apps@msc.benfy.mongodb.net/?retryWrites=true&w=majority&appName=MSc');

// Connection success
mongoose.connection.once('open', () => {
    console.log('Connected to the database successfully!');
});

// Connection error
mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to the database:', err);
});

// Disconnection event
mongoose.connection.on('disconnected', () => {
    console.warn('Database connection lost.');
});

// Get all tasks
app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

// Update task status
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { done } = req.body; // Getting the updated 'done' status from the request body

    TodoModel.findByIdAndUpdate({ _id: id }, { done }, { new: true })
        .then(result => res.json(result)) // Return the updated task to frontend
        .catch(err => res.json(err));
});

// Edit the task
app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { task, done } = req.body; // Get task and done status from the request body

    TodoModel.findByIdAndUpdate({ _id: id }, { task, done }, { new: true })
        .then(result => res.json(result)) // Return the updated task
        .catch(err => res.json(err));
});

// Add new task
app.post("/add", (req, res) => {
    const task = req.body.task;
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
        .catch(err => res.json(err));
});

// Delete task
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
        .then(() => res.json({ message: "Task deleted successfully" }))
        .catch(err => res.json(err));
});

app.listen(3001, () => {
    console.log("Server is Running");
});

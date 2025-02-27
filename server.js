const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 7777;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/students');

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log("Connection Successful!");
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const Users = mongoose.model("data", userSchema);

// Route to serve form.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Route to handle form submission
app.post('/post', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate data
    if (!name || !password) {
      throw new Error('Name and password are required.');
    }

    const users = new Users({
      name,
      password
    });

    await users.save();
    console.log(users);
    res.send("Login Successful");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save data.");
  }
});

// Start server
app.listen(port, () => {
  console.log("Server Started!");
});

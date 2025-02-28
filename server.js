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
  const data = {
    name: req.body.username,
    password: req.body.password
  } 
try{
  const userdata = await Users.insertMany(data);
  console.log(userdata);
  res.send("Login Success!")
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save data.");
  }
});

app.post('/login',async(req,res)=>{
  try{
    const check =await Users.findOne({name:req.body.username});
    if(!check){
      res.send("Id not found");
      return;
    }
    const isPasswordMatch = req.body.password ===check.password;
    if(!isPasswordMatch){
      res.send("Wrong Password");
      return;
    }
    else{
      res.send("Welcome");
      return;
    }
  }
  catch{}
    res.send("Wrong Details");
    return;
})

// Start server
app.listen(port, () => {
  console.log("Server Started!");
});

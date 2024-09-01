const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/Database", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", () => console.log("Error connecting to database"));
db.once("open", () => console.log("Connected to database"));

// Registration Route
app.post("/sign_up", (req, res) => {
  const { name, age, phone, email, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = bcrypt.hashSync(password, 10);

  const data = {
    name,
    age,
    phone,
    email,
    password: hashedPassword, // Store the hashed password
  };

  console.log("Original Password:", password); // Debugging log
  console.log("Hashed Password:", hashedPassword); // Debugging log

  db.collection("users").insertOne(data, (err, collection) => {
    if (err) {
      throw err;
    }
    console.log("Record inserted successfully");
    res.redirect("signup_successful.html");
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.collection("users").findOne({ email: username }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error logging in");
    }
    if (!user) {
      console.log("User not found");
      return res.status(401).send("User not found");
    }

    console.log("Entered Password:", password); // Debugging log
    console.log("Stored Hashed Password:", user.password); // Debugging log

    // Compare entered password with the stored hashed password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    console.log("Password Match:", isValidPassword); // Debugging log

    if (isValidPassword) {
      console.log("Login successful");
      return res.redirect("login_successful.html");
    } else {
      console.log("Invalid password");
      return res.status(401).send("Invalid password");
    }
  });
});

// Routes to serve HTML files
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// Start the server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});

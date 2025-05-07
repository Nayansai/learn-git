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




Here are four realistic scenarios you can implement using Apex Triggers in your Salesforce project, showcasing complex business logic, Apex Sharing, Team Sharing, Custom Metadata/Settings, and Email sending:


---

Scenario 1: Auto-Assign Team and Share Opportunities Based on Region

Goal: Automatically assign users to an Opportunity Team and share the record when a new Opportunity is created.

Key Features:

Custom Metadata: Stores region-wise default team members.

Apex Trigger: On Opportunity insert.

Apex Sharing: Shares the Opportunity with users.

Enable Team Sharing: Adds users to Opportunity Team.


Trigger Logic:

Identify region from Opportunity.

Fetch team members from Custom Metadata.

Use OpportunityTeamMember to assign users.

Create OpportunityShare records to allow access.



---

Scenario 2: Prevent High-Risk Accounts Using Custom Settings

Goal: Block Account creation from specific industries marked as high-risk.

Key Features:

Custom Settings: Stores restricted industries.

Apex Trigger: Before insert on Account.

Complex Logic: Checks business criteria to allow or block.


Trigger Logic:

On before insert, compare Account industry with the restricted list.

If found, add an error to stop the record creation.



---

Scenario 3: Auto-Notify Manager on High-Value Opportunity Close

Goal: When an Opportunity with value > $100,000 is closed, notify the manager.

Key Features:

Send Email from Apex: Email is sent to the manager.

Custom Metadata: Stores threshold and email template ID.

Apex Trigger: After update on Opportunity.


Trigger Logic:

Detect when Stage is changed to "Closed Won" and Amount > threshold.

Fetch manager email from User hierarchy.

Use Messaging.SingleEmailMessage to send notification.



---

Scenario 4: Implement Manual Sharing of Cases Based on Priority

Goal: Share high-priority cases with a support group for escalation.

Key Features:

Apex Sharing: Manually create CaseShare.

Custom Metadata: Stores escalation team User IDs or Group IDs.

Apex Trigger: After insert/update on Case.


Trigger Logic:

When a Case priority is "High", fetch group ID from metadata.

Share the Case with read/write access.



---

Would you like Apex code samples or metadata definitions for any of these scenarios?


const express = require('express');
const bodyParser = require('body-parser');
const Database = require('@replit/database');
const app = express();
const port = process.env.PORT || 3000;

const db = new Database(); // Initialize the database

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/save-email', async (req, res) => {
  const { email } = req.body;
  try {
    await db.set(`email_${Date.now()}`, email); // Use a unique key for each email
    console.log('Email saved:', email);
    res.send('Email saved');
  } catch (err) {
    console.error('Error saving email:', err);
    res.status(500).send('Error saving email');
  }
});

app.get('/get-emails', async (req, res) => {
    try {
        const keys = await db.list("email_"); // List all keys starting with 'email_'
        const emails = await Promise.all(keys.map(key => db.get(key)));
        res.send(emails);
    } catch (err) {
        console.error('Error retrieving emails:', err);
        res.status(500).send('Error retrieving emails');
    }
});


async function logAllEmails() {
  try {
      const keys = await db.list("email_");
      const emails = await Promise.all(keys.map(key => db.get(key)));
      console.log(emails);
  } catch (err) {
      console.error('Error retrieving emails:', err);
  }
}

logAllEmails(); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




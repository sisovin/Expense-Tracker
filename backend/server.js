const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

const DATA_FILE = path.join(__dirname, 'db/data.json');

app.get('/expenses', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.expenses);
  });
});

app.post('/expenses', (req, res) => {
  console.log('Incoming request body:', req.body);

  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing data:', parseErr);
      return res.status(500).send('Error parsing data');
    }
    const newExpense = {
      id: Date.now(),
      description: req.body.description || 'No description provided',
      amount: req.body.amount || '0',
    };
    console.log('Adding new expense:', newExpense);
    jsonData.expenses.push(newExpense);
    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing data:', err);
        return res.status(500).send('Error writing data');
      }
      res.status(201).json(newExpense);
    });
  });
});

app.put('/expenses/:id', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing data:', parseErr);
      return res.status(500).send('Error parsing data');
    }
    const updatedExpense = jsonData.expenses.find(
      (expense) => expense.id === parseInt(req.params.id, 10)
    );
    if (updatedExpense) {
      updatedExpense.description = req.body.description;
      updatedExpense.amount = req.body.amount;
      fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error('Error writing data:', err);
          return res.status(500).send('Error writing data');
        }
        res.status(200).json(updatedExpense);
      });
    } else {
      res.status(404).send('Expense not found');
    }
  });
});

app.delete('/expenses/:id', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error('Error parsing data:', parseErr);
      return res.status(500).send('Error parsing data');
    }
    jsonData.expenses = jsonData.expenses.filter(
      (expense) => expense.id !== parseInt(req.params.id, 10)
    );
    if (jsonData.expenses.length === 0) {
      jsonData.expenses.push({ id: '', description: '', amount: '' });
    }
    fs.writeFile(DATA_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error('Error writing data:', err);
        return res.status(500).send('Error writing data');
      }
      res.status(204).send();
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

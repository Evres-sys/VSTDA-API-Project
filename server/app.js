const express = require('express');
const morgan = require('morgan');
//const data = require('./data.json');
const fs = require('fs');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

let jsonData = [];
const dataPath = './data.json';

try {
    const file = fs.readFileSync('data.json', 'utf8');
    jsonData = JSON.parse(file);
} catch (err) {
    console.error('Error reading file:', err);
}

app.get('/', (req, res) => {
    try {
        res.status(200).send({
            status: 'ok'
        });
    } catch (err) {
        console.error('Error:', err);
    }
});

app.get('/api/ToDoItems', (req, res) => {
    try {
        res.status(200).send(jsonData);
    } catch (err) {
        console.error('Error:', err);
    }
});

app.post('/api/ToDoItems', (req, res) => {
    const newItem = {...req.body};
    jsonData.push(newItem);

    fs.writeFile(dataPath, JSON.stringify (jsonData, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing to data file');
        }
        res.status(201).send(newItem);
    });
});

app.get('/api/ToDoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemFiltered = jsonData.find(item => item.todoItemId === id);
    
    if (itemFiltered) {
        return res.status(200).send(itemFiltered);
    } else {
        return res.status(404).send('Error: No matching ID');
    }
});

app.delete('/api/ToDoItems/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = jsonData.findIndex(item => item.todoItemId === id)
    if (index === -1) {
        return res.status(404).send('Error: No matching ID')
    }
    const removedItem = jsonData.splice(index, 1);
    fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Error writing to data file');
        }
        return res.status(200).send(removedItem[0]);
    });
   
});

module.exports = app;

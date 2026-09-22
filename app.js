const express = require('express');
const getGreeting = require('./greeting');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send(getGreeting()));

app.listen(port);
console.log(`App running on http://localhost:${port}`);

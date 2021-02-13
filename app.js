const path = require('path');
const express = require('express');
const registration = require('./src/registration');
const { setup } = require('./src/db');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', registration);

setup();

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});

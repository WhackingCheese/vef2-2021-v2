const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const registration = require('./src/registration');
const { setup } = require('./src/db');

dotenv.config();

const {
  PORT: port = 3000,
} = process.env;

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', registration);

setup();

app.listen(port, () => {
  console.info(`Server running at http://$localhost:${port}/`);
});

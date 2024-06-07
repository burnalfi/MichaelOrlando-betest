const express = require('express');
const mongoose = require('mongoose');
const AccountRoute = require('./routes/account')
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.port;
const dbPort = process.env.dbPort;
const dbName = process.env.dbName;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/account', AccountRoute);

app.get('/ping', (req, res) => {
	res.send('pong!');
});

app.listen(port, () => {
	console.log(`Connecting to database on port ${dbPort}`);

	mongoose
		.connect(`mongodb://127.0.0.1:${dbPort}/${dbName}`)
		.then(() => {
			console.log('Database connection established.');
		})
		.catch((err) => {
			console.error(err.message);
		});

	console.log(`App is running on port ${port}!`);
});
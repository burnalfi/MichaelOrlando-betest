const express = require('express');
const mongoose = require('mongoose');
const AccountRoute = require('./routes/account');
const UserInfoRoute = require('./routes/userInfo');
const AccountLoginRoute = require('./routes/accountLogin');
const Middleware = require('./middlewares');
const http =  require("http");
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.port || 3000;
const dbPort = process.env.dbPort;
const dbName = process.env.dbName;
const dbUrl = process.env.dbUrl;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/account', AccountRoute);
app.use('/user-info', Middleware.verifyToken, UserInfoRoute);
app.use('/account-login', Middleware.verifyToken, AccountLoginRoute);

app.use('/ping', (req, res) => {
	res.send('pong!');
});
const server = http.createServer(app)
server.listen(port, () => {
	console.log(`Connecting to database on port ${dbPort}`);

	mongoose
		.connect(dbUrl)
		.then(() => {
			console.log('Database connection established.');
		})
		.catch((err) => {
			console.error(err.message);
		});

	console.log(`App is running on port ${port}!`);
});
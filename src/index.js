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

const port = process.env.PORT || 3000;
const dbPort = process.env.dbPort;
const dbName = process.env.dbName;
const dbUrl = process.env.dbUrl;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/account', AccountRoute);
app.use('/user-info', Middleware.verifyToken, UserInfoRoute);
app.use('/account-login', Middleware.verifyToken, AccountLoginRoute);

app.use('/', (req, res) => {
	res.send('Test Backend Michael Orlando');
});
const server = http.createServer(app)
server.listen(port, '0.0.0.0', () => {
	console.log(`Connecting to database on port ${dbPort}`);

	mongoose
		.connect(dbUrl)
		.then(() => {
			console.log('Database connection established.');
		})
		.catch((err) => {
			console.error(err.message);
		});

	console.log()

	console.log(`App is running on port ${port}!`);
});
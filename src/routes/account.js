const express = require('express');
const Account = require('../controllers/account');

const route = express.Router();
const accountController = Account.AccountController;

route.post('/register', async (req, res) => {
	const response = await accountController.register(res, req.body);
	return res.status(response.statusCode).json(response);
});

route.post('/login', async (req, res) => {
	const response = await accountController.login(res, req.body);
	return res.status(response.statusCode).json(response);
});

const AccountRoute = route;

module.exports = AccountRoute;

const express = require('express');
const Account = require('../controllers/account');

const route = express.Router();
const accountController = Account.AccountController;

route.post('/register', async (req, res) => {
	return await accountController.register(res, req.body);
});

route.post('/login', async (req, res) => {
	return await accountController.login(res, req.body);
});

const AccountRoute = route;

module.exports = AccountRoute;

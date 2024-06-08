const express = require('express');
const AccountLogin = require('../controllers/accountLogin');

const route = express.Router();
const accountLoginController = AccountLogin.AccountLoginController;

route.get('/login-time', async (req, res) => {
	const response = await accountLoginController.getAccountLoginByLastLoginDate();
	return res.status(response.statusCode).json(response);
});

const AccountLoginRoute = route;

module.exports = AccountLoginRoute;
const express = require('express');
const AccountLogin = require('../controllers/accountLogin');

const route = express.Router();
const accountLoginController = AccountLogin.AccountLoginController;

route.get('/login-time', async (req, res) => {
	return await accountLoginController.getAccountLoginByLastLoginDate(res);
});

const AccountLoginRoute = route;

module.exports = AccountLoginRoute;
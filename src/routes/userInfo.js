const express = require('express');
const UserInfo = require('../controllers/userInfo');

const route = express.Router();
const userInfoController = UserInfo.UserInfoController;


// Get user info by account number
route.get('/account-number/:accountNumber', async (req, res) => {
	const response = await userInfoController.getUserInfoByAccountNumber(req.params.accountNumber);
	return res.status(response.statusCode).json(response);
});

// Get user info by registration number
route.get('/registration-number/:registrationNumber', async (req, res) => {
	const response = await userInfoController.getUserInfoByRegistrationNumber(req.params.registrationNumber);
	return res.status(response.statusCode).json(response);
});

// User info with Redis
route.get('/session', async (req, res) => {
	const response = await userInfoController.getUserInfoByRedisCache(req);
	return res.status(response.statusCode).json(response);
})

const UserInfoRoute = route;

module.exports = UserInfoRoute;

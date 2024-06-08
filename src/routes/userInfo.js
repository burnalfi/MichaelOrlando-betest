const express = require('express');
const UserInfo = require('../controllers/userInfo');

const route = express.Router();
const userInfoController = UserInfo.UserInfoController;

route.get('/account-number/:accountNumber', async (req, res) => {
	return await userInfoController.getUserInfoByAccountNumber(res, req.params.accountNumber);
});

route.get('/registration-number/:registrationNumber', async (req, res) => {
	return await userInfoController.getUserInfoByRegistrationNumber(res, req.params.registrationNumber);
});


const UserInfoRoute = route;

module.exports = UserInfoRoute;

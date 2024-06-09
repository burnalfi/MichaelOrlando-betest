const AccountLoginMod = require('../models/accountLogin');
const AccountLoginCont = require('../controllers/accountLogin');
const mongoose = require('mongoose');
const uuid = require('uuid');
require('dotenv').config();

const accountLoginController = AccountLoginCont.AccountLoginController;

mongoose
	.connect(process.env.dbUrl)
	.then(() => {
		console.log('Database connection established.');
	})
	.catch((err) => {
		console.error(err.message);
	});

test.concurrent('Get account login data with last login time > 3 days ago', async () => {
	let accountLogin = await AccountLoginMod.AccountLoginModel.create({
		userName: uuid.v4(),
		password: uuid.v4(),
		lastLoginDateTime: new Date((new Date()).setDate(new Date().getDate() - 3))
	});

	let testCase = await accountLoginController.getAccountLoginByLastLoginDate();

	expect(testCase.status).toMatch("success");
	expect(testCase.content).toBeDefined();
	expect(testCase.statusCode).toBe(200);

	await AccountLoginMod.AccountLoginModel.deleteOne({ _id: accountLogin._id });
}, 15000)
const UserInfo = require('../controllers/userInfo');
const UserInfoMod = require('../models/userInfo');
const AccountLoginMod = require('../models/accountLogin');
const mongoose = require('mongoose');
const uuid = require('uuid');

const userInfoController = UserInfo.UserInfoController;

mongoose
	.connect(`mongodb://127.0.0.1:27017/db_MichaelOrlando_betest`)
	.then(() => {
		console.log('Database connection established.');
	})
	.catch((err) => {
		console.error(err.message);
	});

test.concurrent("Get user info by it's account number", async () => {
	let accountLogin = await AccountLoginMod.AccountLoginModel.create({
		userName: uuid.v4(),
		password: uuid.v4(),
	});

	let userInfo = await UserInfoMod.UserInfoModel.create({
		fullName: "Test full name",
		emailAddress: "Test email address",
		registrationNumber: uuid.v4(),
		accountNumber: accountLogin._id
	});

	let testCase = await userInfoController.getUserInfoByAccountNumber("6664add17615663fa17ca8dd");

	expect(testCase.status).toMatch("success");
	expect(testCase.content).toBeDefined();
	expect(testCase.statusCode).toBe(200);
	
	await Promise.all([
		UserInfoMod.UserInfoModel.deleteOne({ _id: userInfo._id }),
		AccountLoginMod.AccountLoginModel.deleteOne({ _id: accountLogin._id })
	]);
}, 15000)

test.concurrent("Get user info by it's registration number", async () => {
	let userInfo = await UserInfoMod.UserInfoModel.create({
		fullName: "Test full name 2",
		emailAddress: "Test email address 2",
		registrationNumber: uuid.v4()
	});

	
	let testCase = await userInfoController.getUserInfoByRegistrationNumber('1e990008-c547-4b6e-b769-6967d657f248');

	expect(testCase.status).toMatch("success");
	expect(testCase.content).toBeDefined();
	expect(testCase.statusCode).toBe(200);
	
	await UserInfoMod.UserInfoModel.deleteOne({ _id: userInfo._id });
}, 20000)
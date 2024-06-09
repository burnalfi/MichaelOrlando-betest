const UserInfo = require('../models/userInfo');
const { redisClient } = require('../redisClient');

class UserInfoController {
	// Get user info by account number
	static async getUserInfoByAccountNumber(accountNumber) {
		const userInfo = await UserInfo.UserInfoModel.findOne({ accountNumber: accountNumber });
		
		if (!userInfo) return {
			status: "success",
			content: "Not found.",
			statusCode: 404
		}
		
		return {
			status: "success",
			content: userInfo,
			statusCode: 200
		}
	}

	// Get user info by registration number
	static async getUserInfoByRegistrationNumber(registrationNumber) {
		const userInfo = await UserInfo.UserInfoModel.findOne({ registrationNumber: registrationNumber });
		
		if (!userInfo) return {
			status: "success",
			content: "Not found.",
			statusCode: 404
		}
		
		return {
			status: "success",
			content: userInfo,
			statusCode: 200
		}
	}

	// User info with Redis
	static async getUserInfoByRedisCache(req) {
		await redisClient.connect();
		let userInfo = await redisClient.get(`userInfo:${req.user.userInfo.id}`);
		await redisClient.disconnect();
		if (userInfo) {
			userInfo = JSON.parse(userInfo);
			return {
				status: "success",
				content: userInfo,
				statusCode: 200
			}
		}
		userInfo = await UserInfo.UserInfoModel.findOne({ _id: req.user.userInfo.id });
		if (!userInfo) return {
			status: "success",
			content: "User info data was not found.",
			statusCode: 404
		}
		return {
			status: "success",
			content: userInfo,
			statusCode: 200
		}
	}
}

module.exports = {
	UserInfoController
}
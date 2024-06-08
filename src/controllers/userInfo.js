const UserInfo = require('../models/userInfo');

class UserInfoController {
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
}

module.exports = {
	UserInfoController
}
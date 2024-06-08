const UserInfo = require('../models/userInfo');

class UserInfoController {
	static async getUserInfoByAccountNumber(res, accountNumber) {
		const userInfo = await UserInfo.UserInfoModel.findOne({ accountNumber: accountNumber });
		
		if (!userInfo) return res.status(404).json({
			status: "success",
			content: "Not found."
		});
		
		return res.status(200).json({
			status: "success",
			content: userInfo
		});
	}

	static async getUserInfoByRegistrationNumber(res, registrationNumber) {
		const userInfo = await UserInfo.UserInfoModel.findOne({ registrationNumber: registrationNumber });
		
		if (!userInfo) return res.status(404).json({
			status: "success",
			content: "Not found."
		});
		
		return res.status(200).json({
			status: "success",
			content: userInfo
		});
	}
}

module.exports = {
	UserInfoController
}
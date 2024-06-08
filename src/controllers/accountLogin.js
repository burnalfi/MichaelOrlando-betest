const AccountLogin = require('../models/accountLogin');

class AccountLoginController {
	static async getAccountLoginByLastLoginDate(res) {
		
		console.log(new Date((new Date()).setDate(new Date().getDate() + 4)));

		const accountLogin = await AccountLogin.AccountLoginModel.find({
			lastLoginDateTime: {
				$gte: new Date((new Date()).setDate(new Date().getDate() + 4))
			}
		});
		
		if (accountLogin.length == 0) return res.status(404).json({
			status: "success",
			content: "No data was found."
		})
	}
}

module.exports = {
	AccountLoginController
}
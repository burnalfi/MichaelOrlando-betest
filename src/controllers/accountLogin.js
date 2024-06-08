const AccountLogin = require('../models/accountLogin');

class AccountLoginController {
	static async getAccountLoginByLastLoginDate() {
		
		console.log(new Date((new Date()).setDate(new Date().getDate() - 4)));

		let accountLogin = await AccountLogin.AccountLoginModel.find();

		accountLogin = accountLogin.filter(al => {
			let today = new Date()
			let alDate = new Date(al.lastLoginDateTime);
			
			if (today.getFullYear() == alDate.getFullYear() && today.getMonth() == alDate.getMonth() && today.getDate() - alDate.getDate() >= 3) return al;
			else if (today.getFullYear() == alDate.getFullYear() && today.getMonth() > alDate.getMonth()) return al;
			else if (today.getFullYear() > alDate.getFullYear()) return al;
		});

		if (accountLogin.length == 0) return {
			status: "success",
			content: "No data was found.",
			statusCode: 404
		}

		return {
			status: "success",
			content: accountLogin,
			statusCode: 200
		}
	}
}

module.exports = {
	AccountLoginController
}
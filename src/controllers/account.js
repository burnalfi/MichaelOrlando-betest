const UserInfo = require('../models/userInfo');
const AccountLogin = require('../models/accountLogin');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

class AccountController {
	static async register(res, body) {
		const { userName, password, fullName, emailAddress, registrationNumber } = body;
		if (!userName || !password || !fullName || !emailAddress || !registrationNumber) {
			return {
				status: "failed",
				content: `Body data must be complete.`,
				statusCode: 400
			}
		}
		const usernameCheck = await AccountLogin.AccountLoginModel.findOne({ userName: userName });
		console.log(usernameCheck)
		if (usernameCheck) return {
			status: "failed",
			content: "Username already exists. Please select another username.",
			statusCode: 400
		};
		
		const hashedPassword = bcrypt.hashSync(password, 10);
		let [accountLogin, userInfo] = await Promise.all([
			AccountLogin.AccountLoginModel.create({
				userName: userName,
				password: hashedPassword,
			}),
			UserInfo.UserInfoModel.create({
				fullName: fullName,
				emailAddress: emailAddress,
				registrationNumber: uuid.v4()
			})
		]);

		[accountLogin, userInfo] = await Promise.all([
			AccountLogin.AccountLoginModel.findOneAndUpdate({ _id: accountLogin._id }, { userId: userInfo._id }, { new: true }),
			UserInfo.UserInfoModel.findOneAndUpdate({ _id: userInfo._id }, { accountNumber: accountLogin._id }, { new: true })
		]);

		return {
			status: "success",
			content: { acountLogin: accountLogin, userInfo: userInfo },
			statusCode: 201
		}
	}

	static async login(res, body) {
		const { userName, password } = body;
		if (!userName || !password) return {
				status: "failed",
				content: `userName and password must be filled.`,
				statusCode: 400
			};
		

		const usernameCheck = await AccountLogin.AccountLoginModel.findOne({ userName: userName });

		if (!usernameCheck) return {
			status: "failed",
			content: "Username or password is wrong.",
			statusCode: 400
		};

		let [_, userInfo] = await Promise.all([
			AccountLogin.AccountLoginModel.findOneAndUpdate({ userName: userName }, { lastLoginDateTime: new Date() }),
			UserInfo.UserInfoModel.findById(usernameCheck.userId.toString())
		]);

		usernameCheck._doc.userInfo = userInfo;
		
		if (!(await bcrypt.compare(password, usernameCheck.password))) return {
			status: "failed",
			content: `userName and password must be filled.`,
			statusCode: 400
		};
		

   		const token = jwt.sign(usernameCheck.toJSON(), process.env.secret_key, {
            expiresIn: 1000
        });

        const { iat, exp } = jwt.decode(token);

		return {
			status: "success",
			content: {
				token: token,
				iat: iat,
				exp: exp,
			},
			statusCode: 201
		};
	}
}

module.exports = {
	AccountController
}
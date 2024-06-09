const UserInfo = require('../models/userInfo');
const AccountLogin = require('../models/accountLogin');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { redisClient } = require('../redisClient');

class AccountController {
	static async register(res, body) {
		const { userName, password, fullName, emailAddress } = body;
		if (!userName || !password || !fullName || !emailAddress ) {
			return {
				status: "failed",
				content: `Body data must be complete.`,
				statusCode: 400
			}
		}
		const usernameCheck = await AccountLogin.AccountLoginModel.findOne({ userName: userName });

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
		try {
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
	
			if (!userInfo) return {
				status: "failed",
				content: "Account login data does not have a user-info.",
				statusCode: 400
			}
	
			usernameCheck._doc.userInfo = userInfo;
			
			if (!(await bcrypt.compare(password, usernameCheck.password))) return {
				status: "failed",
				content: `userName and password must be filled.`,
				statusCode: 400
			};
	
			await redisClient.connect();
			await redisClient.set(
				`userInfo:${userInfo._id}`,
				`{"fullName": "${userInfo.fullName}","accountNumber": "${userInfo.accountNumber}","emailAddress": "${userInfo.emailAddress}", "registrationNumber": "${userInfo.registrationNumber}"}`,
				'EX',
				new Date().setHours(1) / 1000
			);
			await redisClient.disconnect();
	
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
		} catch(e) {
			console.log(e);
			return {
				status: "failed",
				content: e.message,
				statusCode: 500
			}
		}
	}
}

module.exports = {
	AccountController
}
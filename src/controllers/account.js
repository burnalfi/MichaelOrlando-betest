const UserInfo = require('../models/userInfo');
const AccountLogin = require('../models/accountLogin');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

class AccountController {
	static async register(res, body) {
		const { userName, password, fullName, emailAddress, registrationNumber } = body;
		if (!userName || !password || !fullName || !emailAddress || !registrationNumber) {
			return res.status(400).json({
				status: "failed",
				content: `Body data must be complete.`
			});
		}
		const usernameCheck = await AccountLogin.AccountLoginModel.findOne({ userName: userName });
		console.log(usernameCheck)
		if (usernameCheck) return res.status(400).json({
			status: "failed",
			content: "Username already exists. Please select another username."
		});
		
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

		return res.status(201).json({
			status: "success",
			content: { acountLogin: accountLogin, userInfo: userInfo }
		})
	}

	static async login(res, body) {
		const { userName, password } = body;
		if (!userName || !password) {
			return res.status(400).json({
				status: "failed",
				content: `userName and password must be filled.`
			});
		}

		const usernameCheck = await AccountLogin.AccountLoginModel.findOne({ userName: userName });

		
		if (!usernameCheck) return res.status(400).json({
			status: "failed",
			content: "Username or password is wrong."
		});

		let [_, userInfo] = await Promise.all([
			AccountLogin.AccountLoginModel.findOneAndUpdate({ userName: userName }, { lastLoginDateTime: new Date() }),
			UserInfo.UserInfoModel.findById(usernameCheck.userId.toString())
		]);

		usernameCheck._doc.userInfo = userInfo;
		
		if (!(await bcrypt.compare(password, usernameCheck.password))) {
			return res.status(400).json({
				status: "failed",
				content: `userName and password must be filled.`
			});
		}

   		const token = jwt.sign(usernameCheck.toJSON(), process.env.secret_key, {
            expiresIn: 1000
        });

        const { iat, exp } = jwt.decode(token);

		return res.status(201).json({
			status: "success",
			content: {
				token: token,
				iat: iat,
				exp: exp,
			}
		});
	}
}

module.exports = {
	AccountController
}